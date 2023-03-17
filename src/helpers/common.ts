import crypto from 'crypto';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function getImgName(url: string): string {
  const res = url.match(/(\/)([^\/]+)(\.\w+)$/);
  return res ? res[2] : '';
}
/*

console.log(getImgName('https://www.avito.st/s/common/components/monetization/icons/web/x15_1.svg'));
console.log('*',getImgName('x15_1.svg'));
*/

export function getHost(urlOrg: string) {
  const url = new URL(urlOrg);
  try {
    const s = url.hostname.match(/\w+\.\w+$/);
    return s ? s![0] : urlOrg;
  } catch (e) {
    console.log(urlOrg);
    process.exit(0);
  }
}

// console.log(getHost(`https://www.googletagmanager.com/gtm.js?id=GTM-MNC9HXP`));
// console.log(getHost(`www.googletagmanager.com/gtm.js?id=GTM-MNC9HXP`));
/*console.log(
  getHost(
    'https://55.img.avito.st/image/1/1.vvOueba6EhqY0NAf3k-J2kfaFB4aWhrYH9oWEhLSEA.OqZRqaOxiUwpNE5iENiQvKVq6L4SgOa-e-PLwDBFDGs',
  ),
);*/

export function getOrigin(s: string) {
  const u = new URL(s);
  return u.origin;
}
/*
console.log(
  getOrigin(
    'https://55.img.avito.st/image/1/1.vvOueba6EhqY0NAf3k-J2kfaFB4aWhrYH9oWEhLSEA.OqZRqaOxiUwpNE5iENiQvKVq6L4SgOa-e-PLwDBFDGs',
  ),
);
// https://55.img.avito.st
*/

export function getIdOfAd(s: string) {
  return s ? s.substring(2) : null;
}

/*

console.log(getIdOfAd('№ 1004644332'));
console.log('*', getIdOfAd(''), '*');
console.log('*', getIdOfAd(null), '*');
*/

export function getUserID(user: string | null): string {
  if (!user) return null;
  const match = user.match(/(\/user\/)(.+)\//);
  return match ? match[2] : user;
}

/*console.log(
  getUserID(
    'https://www.avito.ru/user1/fee7dcbfd8f8b20ac6364c7e8d5795c7/profile?id=1004644332&src=item&page_from=from_item_card&iid=1004644332',
  ),
);
*/
// console.log(getUserID('/user/19ca96d0461761e7a0f8e770d9e446b3/profile?src=search_seller_info'));
// console.log(getUserID(null));

//
// console.log(
//   getHost(
//     'https://ad.adriver.ru/cgi-bin/erle.cgi?sid=223878&bt=62&custom=157%3Dundefined%3B10%3Dundefined%3B206%3DDSPCounter&ph=0&rnd=453032&tail256=unknown',
//   ),
// );
//
// console.log(getHost('https://tube.buzzoola.com/new/build/buzzcommon.754a83e96bd396f425e1032775435694.js'));
// console.log(getHost('https://ssla.com/new/build/buzzcommon.754a83e96bd396f425e1032775435694.js'));

// console.log(getUserID('/user/82811b633dff6a796e0b6caec321138b/profile?src=search_seller_info'));

export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export async function delayRnd(minSec: number, maxSec: number) {
  const delaySeconds = getRandomArbitrary(minSec * 1000, maxSec * 1000);
  return new Promise((resolve) => {
    setTimeout(resolve, delaySeconds);
  });
}

export function delay(ms = 10_000) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(0), ms);
  });
}

// console.log(getRandomArbitrary(1000, 2000));

//  "http://104.143.245.20:6260"
export function getIpFromServer(server: string | null) {
  if (!server) return null;
  const match = server.match(/^(https?:\/\/)(.*):([0-9]*)$/i);
  return match ? match[2] : null;
}

// console.log(getIpFromServer('https://104.143.245.20:6260'));
// console.log(getIpFromServer(null));

const SALT = '$ome$alt';
export function generateHash(pass: string) {
  return crypto.createHmac('sha256', SALT).update(pass).digest('hex');
}

export function isFileExists(path: string): boolean {
  let exists = false;
  try {
    fs.statSync(path);
    exists = true;
  } catch (e) {
    exists = false;
  }
  return exists;
}

/*
console.log(
  isFileExists(
    path.resolve(process.cwd(), './cache', '1c2ce7965bceeceaf77dedf98143e125b2056f3811c1049dcc118174758e881d'),
  ),
);
*/

export function ConvertStringToHex(str: string) {
  const arr = [];
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i).toString(16);
  }
  return arr.join('');
}

export function ConvertHexToString(str: string) {
  const arr = [];
  for (let i = 0; i < str.length; i = i + 2) {
    arr[i] = String.fromCharCode(parseInt(str[i] + str[i + 1], 16));
  }
  return arr.join('');
}

// console.log(ConvertStringToHex(`text/css;\+\&`));
// console.log(ConvertHexToString('746578742f6373733b2b26'));

// массив
let cacheFileNames: Array<string> = [];
export function initFileCache() {
  const paths = path.resolve(process.cwd(), './cache');
  cacheFileNames = fs.readdirSync(paths);
}

export function isFileInCacheExists(s: string) {
  const f = cacheFileNames.find((value) => value.startsWith(s));
  if (f) {
    const contentType = ConvertHexToString(f.substring(f.indexOf('.') + 1));
    return { fname: path.resolve(process.cwd(), './cache', f), contentType };
  }
  return null;
}

export function addFileToCash(fname: string) {
  cacheFileNames.push(fname);
}

// initFileCache();
// console.log(isFileInCacheExists('0a25b0f1421c3cca07ecf0cc677b24f6972ae18a76b8e7211f5df463dbfe55aa'));

/*
 * добавляет номер страницы в запрос
 */
export function urlPageNum(urls: string, currentPage: number): string {
  const url = new URL(urls);
  const searchParams = new URLSearchParams(url.search);
  if (searchParams.has('p')) {
    searchParams.set('p', currentPage.toString());
  } else {
    searchParams.append('p', currentPage.toString());
  }

  return url.origin + url.pathname + '?' + searchParams.toString();
}

// console.log(urlPageNum('https://www.avito.ru/moskva_i_mo/predlozheniya_uslug?cd=1&f=ASg', 1));
// console.log(urlPageNum('https://www.avito.ru/moskva_i_mo/predlozheniya_uslug?cd=1&p=2&f=ASg', 3));

export function isPageNumInUrl(urls: string): boolean {
  const url = new URL(urls);
  const searchParams = new URLSearchParams(url.search);
  return searchParams.has('p');
}

// console.log(isPageNumInUrl('https://www.avito.ru/moskva_i_mo/predlozheniya_uslug?cd=1&f=ASg'));
// console.log(isPageNumInUrl('https://www.avito.ru/moskva_i_mo/predlozheniya_uslug?cd=1&p=2&f=ASg'));

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// const __filename = fileURLToPath(import.meta.url);
