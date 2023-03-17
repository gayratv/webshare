import '../helpers/dotenv-init.js';
import axios, { AxiosInstance } from 'axios';
import {
  ProxyList,
  ProxyListObject,
  ReplacedProxiesList,
  ReplacedProxiesObject,
  ReplaceProxyResult,
} from './webshare-api-types.js';
import { createConnectionA } from '../helpers/mysql-helper.js';
import { Proxy, webShareProxyListApiEntity } from '../entity/Database.js';
import { AvitoCheckOneIp } from './proxy-check-one-IP-fetch.js';
import { NLog } from 'net-socket-connector';
import { getIpFromServer } from '../helpers/common.js';
import * as process from 'process';

const MAX_CHECK_REQUEST = 20;

export class Webshare {
  static log = NLog.getInstance();

  static axiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://proxy.webshare.io/api/v2',
    headers: {
      Authorization: `Token ${process.env.WEBSHARE_API}`,
    },
  });

  // Retrieve Proxy List
  private static async getProxyFromWebshare(): Promise<Array<ProxyListObject>> {
    let fullProxyList: Array<ProxyListObject> = [];
    let urlProxy = 'proxy/list/?mode=direct&page=1&page_size=1000';
    while (true) {
      Webshare.log.info(`Получить список proxy от webshare`);
      const res = await Webshare.axiosInstance.get<ProxyList>(urlProxy);
      fullProxyList = fullProxyList.concat(res.data.results);
      urlProxy = res.data.next;
      if (!urlProxy) break;
      // console.log(res.data.results[0]);
    }
    return fullProxyList;
  }

  /*
   * Получает список proxy от webshare и записиывает в таблицу webShareProxyListApi
   * таблица webShareProxyListApi перед этим полностью очищается
   */
  static async writeProxyListToDatabase() {
    const proxyList = await Webshare.getProxyFromWebshare();
    // console.log(res.data.results[0]);
    const c = await createConnectionA();
    const qListParm = proxyList.map((val) => [
      val.id,
      val.username,
      val.password,
      val.proxy_address,
      val.port,
      val.valid,
      val.last_verification,
      val.country_code,
      val.city_name,
      val.created_at,
      JSON.stringify({
        server: `http://${val.proxy_address}:${val.port}`,
        password: val.password,
        username: val.username,
      }),
    ]);

    await c.query(`truncate table webShareProxyListApi`);
    await c.query(
      `insert into webShareProxyListApi(id, username, password, proxy_address, port, valid, last_verification,
                                      country_code, city_name, created_at, proxyServer)
     values ?`,
      [qListParm],
    );

    // установить признак проверки checkedForAvito
    await c.query(`
    update webShareProxyListApi wSPLA inner join
        proxyList p  on p.proxyServer = wSPLA.proxyServer
    set wSPLA.checkedForAvito=p.checkedForAvito, wSPLA.exist_in_proxyList=1
    where true
    `);
  }
  static async showProfileData() {
    // данные профиля
    const res = await Webshare.axiosInstance.get('profile/');
    return res.data;
  }

  static async checkProxyForAvito() {
    const c = await createConnectionA();
    const [proxyList] = await c.query<webShareProxyListApiEntity[]>(
      `select * from webShareProxyListApi where checkedForAvito is null`,
    );
    Webshare.log.debug('proxyList.length not checked ', proxyList.length);
    if (!proxyList.length) return;

    let currentIndex = 0;
    let windowStart = 0;
    let windowEnd = 0;
    let forIndex = 0;
    const promiseArray = [];
    while (true) {
      if (currentIndex >= proxyList.length) {
        break;
      }
      const webShareProxyListApiEntity = proxyList[currentIndex];
      const checker = new AvitoCheckOneIp(
        NLog.getInstance(),
        webShareProxyListApiEntity.proxyServer,
        webShareProxyListApiEntity.id,
        webShareProxyListApiEntity.idPrimaryKey,
        currentIndex,
      );
      promiseArray[forIndex] = checker.checkAvitoIsGood();
      currentIndex++;
      windowEnd++;
      forIndex++;
      if (forIndex === MAX_CHECK_REQUEST || currentIndex >= proxyList.length) {
        Webshare.log.warn('await Promise.all(promiseArray)');
        const resultChecks = await Promise.all(promiseArray);
        for (let i = windowStart; i < windowEnd; i++) {
          proxyList[i].checkedForAvito = resultChecks[i - windowStart] ? 1 : 0;
        }
        promiseArray.length = 0;
        forIndex = 0;
        windowStart = currentIndex;
        windowEnd = windowStart;
      }
    }

    // работает
    /*for await (const webShareProxyListApiEntity of proxyList) {
      console.log(webShareProxyListApiEntity.id);
      const checker = new AvitoCheckOneIp(NLog.getInstance(), webShareProxyListApiEntity.proxyServer);
      webShareProxyListApiEntity.checkedForAvito = (await checker.checkAvitoIsGood()) ? 1 : 0;
    }*/

    const checkerResults = proxyList.map((value) => [value.idPrimaryKey, value.checkedForAvito]);
    // console.log('checkerResults');
    // console.log(checkerResults);

    const c1 = await createConnectionA();
    await c1.query(`truncate table webShareProxyListApi_temp`);
    await c1.query(
      `insert into webShareProxyListApi_temp(idPrimaryKey, checkedForAvito)
     values ?`,
      [checkerResults],
    );

    await c1.query(`
        update webShareProxyListApi wSPLA inner join
            webShareProxyListApi_temp t  on t.idPrimaryKey = wSPLA.idPrimaryKey
        set wSPLA.checkedForAvito=t.checkedForAvito
    `);
  }

  // *******************************************************************
  // *******************************************************************
  // *******************************************************************
  // const proxy: Proxy = { server: 'http://45.86.62.202:6131', password: '11', username: 'eeee' };
  private static async replaceOneProxy(proxy: Proxy): Promise<boolean | { err: string }> {
    // запросить замену - не более 10 попыток
    let isNewGood: boolean | { err: string } = false;
    const mainProxyForReplace = { ...proxy };
    const c = createConnectionA();

    for (let i = 1; i < 10; i++) {
      const replacedProxy = await Webshare.createProxyReplacement(getIpFromServer(proxy.server), false);
      if (replacedProxy) {
        const newProxy = { ...proxy };
        newProxy.server = replacedProxy.proxyServer;

        // ---
        const checker = new AvitoCheckOneIp(NLog.getInstance(), newProxy);
        isNewGood = await checker.checkAvitoIsGood();
        // ---------

        Webshare.log.debug('Новый proxy', isNewGood ? 'OK' : 'BAD', replacedProxy.proxy_address);
        const params = [
          JSON.stringify(mainProxyForReplace),
          JSON.stringify(proxy),
          JSON.stringify(replacedProxy),
          isNewGood,
        ];
        await c.query(`insert into webShareProxyListApi_repacements(mainProxy, proxyFrom, proxyTo, isGood) values ?`, [
          [params],
        ]);

        if (!isNewGood) proxy.server = newProxy.server; // для следующей попытки
        else {
          Webshare.log.info('Новый IP присвоен за ', i, ' итераций');
          break;
        }
      } else {
        isNewGood = { err: 'ERROR новую замену для прокси не дали' };
        Webshare.log.error('ERROR новую замену для прокси не дали');
      }
    }
    return isNewGood;
  }
  /*
   * createProxyReplacement - на вход передается IP без http
   */
  private static async createProxyReplacement(proxyIp: string, dry_run = false) {
    Webshare.log.debug('createProxyReplacement ', proxyIp);
    try {
      const res = await Webshare.axiosInstance.post<ReplaceProxyResult>('proxy/replace/', {
        to_replace: { type: 'ip_range', ip_range: `${proxyIp}/32` },
        replace_with: [{ type: 'any', count: 1 }],
        dry_run,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Access to config, request, and response
        Webshare.log.error(err.message);
        return null;
      } else {
        // Just a stock error
        Webshare.log.error(`AXIOS Error unknow`);
        return null;
      }
    }

    // новый адрес proxy
    return await Webshare.showReplacedProxies(proxyIp);
  }

  /*
   * listReplacedProxies возвращает только что измененный proxy
   */
  private static async showReplacedProxies(
    oldProxyIP: string,
  ): Promise<{ proxy_address: string; proxyServer: string; id: number; country_code: string } | null> {
    const res = await Webshare.axiosInstance.get<ReplacedProxiesList>(`proxy/list/replaced/?proxy=${oldProxyIP}`);
    if (!res.data.count) return null;
    const p: ReplacedProxiesObject = res.data.results[0];
    return {
      proxy_address: res.data.results[0].replaced_with,
      proxyServer: `http://${res.data.results[0].replaced_with}:${res.data.results[0].replaced_with_port}`,
      id: p.id,
      country_code: p.replaced_with_country_code,
    };
  }

  static async replaceBadProxy() {
    const c = createConnectionA();
    const [pl] = await c.query<webShareProxyListApiEntity[]>(
      `select * from webShareProxyListApi where checkedForAvito=0`,
    );
    if (pl.length === 0) return;
    for await (const webShareProxyListApiEntity of pl) {
      await Webshare.replaceOneProxy(webShareProxyListApiEntity.proxyServer);
    }
  }
  //   --- class end
}

// console.log(await Webshare.showProfileData());

// await Webshare.writeProxyListToDatabase();
// await Webshare.checkProxyForAvito();

// await Webshare.replaceBadProxy();

process.exit(0);

/*
Итого :
1. Загрузи все proxy в базу
 await Webshare.writeProxyListToDatabase();

2. проверь годны ли новые proxy для avito
await Webshare.checkProxyForAvito();

3. Замени плохие proxy
await Webshare.replaceBadProxy();
 */
