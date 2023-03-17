import { CookiesList } from '../entity/Database.js';

export function cookiesCheckExpireDate(c: CookiesList) {
  for (const cElement of c.cookies) {
    if (cElement.expires > 9999999999) {
      cElement.expires = -1;
    }
  }
}
