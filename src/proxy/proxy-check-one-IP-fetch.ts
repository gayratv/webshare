import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { ILogger } from 'net-socket-connector';
import { Proxy } from '../entity/Database.js';
import { FingerprintGenerator } from 'fingerprint-generator';

export class AvitoCheckOneIp {
  public axiosInstance: AxiosInstance = axios.create();
  constructor(
    public log: ILogger,
    serverParam: Proxy,
    public id?: string,
    public idPrimaryKey?: number,
    public currentIndex?: number,
  ) {
    this.prepareAxiosDefaults(serverParam);
  }

  private prepareAxiosDefaults(serverParam: Proxy) {
    // const serverParam: Proxy = { server: 'http://109.207.130.59:8066', password: 'njzazrwz4rol', username: 'wmdzslaf' };
    const fingerprintGenerator = new FingerprintGenerator();
    const fingerprint = fingerprintGenerator.getFingerprint({
      locales: ['ru-RU'],
      operatingSystems: ['windows'],
    });

    const headers = fingerprint.headers;
    headers.Referer = 'https://www.google.com';
    headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';

    const server = serverParam.server.substring(7);
    const [host, port] = server.split(':');

    this.axiosInstance.defaults.headers.common = headers;
    this.axiosInstance.defaults.withCredentials = true;
    this.axiosInstance.defaults.proxy = {
      protocol: 'http',
      host: host,
      port: parseInt(port, 10),
      auth: {
        username: serverParam.username,
        password: serverParam.password,
      },
    };
  }

  async checkAvitoIsGood(): Promise<boolean> {
    let testFetch: AxiosResponse<any>;
    const url = 'https://www.avito.ru';

    try {
      this.log.debug(this.id, this.idPrimaryKey, this.currentIndex);
      testFetch = await this.axiosInstance.get(url);
    } catch (err: unknown) {
      // avito отклонил запрос
      testFetch = null;

      // Посмотрим на ошибку
      // В любом случае выборку надо будет запустить заново чтобы не нарушать порядок объявлений в выдаче
      if (err instanceof AxiosError) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          // 403 ?
          if (err.response.status === 403) {
            this.log.error(this.log.sw('ERROR : авито заблокировало proxy', 'red'));

            return false;
          } else throw err;
        } else if (err.request) {
          // client never received a response, or request never left
          this.log.error(this.log.sw('ERROR : client never received a response, or request never left', 'red'));
          return false;
        } else {
          // anything else
          throw err;
        }
      } else {
        throw err;
      }
    }
    return true;
  }
}
