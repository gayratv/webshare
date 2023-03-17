import { createConnectionA } from './mysql-helper.js';
import { user_profilesEntity } from '../entity/Database.js';

async function cookiesChecker(idUserProfile: number) {
  const c = await createConnectionA();
  const [profile, _] = await c.query<user_profilesEntity[]>(`select * from user_profiles where idUser=:idUserProfile`, {
    idUserProfile,
  });
  if (!profile.length) return;
  // console.log(profile[0].cookies);
  const p = profile[0];
  const cookies = p.cookies.cookies.filter((cook) => cook.domain.includes('avito.ru'));
  // console.log(cookies);
  const origins = p.cookies.origins.filter((org) => org.origin.includes('avito.ru'));
  // console.log(origins[0].localStorage);
  p.cookies.cookies = cookies;
  p.cookies.origins = origins;
  c.query(`update user_profiles set cookies=:newCookies where idUser=:idUserProfile`, {
    idUserProfile,
    newCookies: JSON.stringify(p.cookies),
  });
}

await cookiesChecker(41);
console.log('JOB finish');
