import { createConnectionA } from '../mysql-helper.js';
import { user_profilesEntity } from '../../entity/Database.js';
import dayjs from 'dayjs';

async function cookiesChecker(idUserProfile: number) {
  const c = await createConnectionA();
  const [profile, _] = await c.query<user_profilesEntity[]>(`select * from user_profiles where idUser=:idUserProfile`, {
    idUserProfile,
  });
  if (!profile.length) return;
  // console.log(profile[0].cookies);
  const cookies = profile[0].cookies.cookies;

  const dates = [];
  for (const cCook of cookies) {
    // console.log(cCook.expires, new Date(cCook.expires));
    dates.push(cCook.expires);
  }
  dates.sort();
  let prev = 11;
  let curInd = 0;
  do {
    if (dates[curInd] === prev) {
      dates.splice(curInd, 1);
    } else {
      curInd++;
      prev = dates[curInd];
    }
  } while (curInd < dates.length);
  console.log(dates);

  console.log(cookies.find((val) => val.expires === 1000001674547045));
}

await cookiesChecker(41);
console.log('JOB finish');
