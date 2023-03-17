import dayjs from 'dayjs';

const months: Record<string, string> = {
  января: '01',
  февраля: '02',
  марта: '03',
  апреля: '04',
  мая: '05',
  июня: '06',
  июля: '07',
  августа: '08',
  сентября: '09',
  октября: '10',
  ноября: '11',
  декабря: '12',
};

/*
export function ConvertAvitoAbsoluteDate_old(dateString: string): Date {
  const [day, month, time] = dateString.split(' ');
  const [hour, minute] = time.split(':').map((val) => parseInt(val, 10));

  const date = new Date();
  let year = date.getFullYear();
  if (months[month] === 11 && date.getMonth() === 0) year -= 1; // если январь - то декабрь в прошлом году
  date.setFullYear(year);
  date.setMonth(months[month]);
  date.setDate(parseInt(day, 10));
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(0);
  date.setMilliseconds(0);

  const d = dayjs(date);
  d.add(3, 'hour');
  return d.toDate();
}
*/
// console.log(ConvertAvitoAbsoluteDate('11 января 19:53').toString());

// {"absoluteDate": "29 января 23:19", "relativeDate": "1 неделю назад"}
// {"absoluteDate": "8 февраля 20:59", "relativeDate": "2 дня назад"}
// update adsList2 set date='2010-12-31 01:15:00' where idAdsList=1;
// update adsList2 set date='2023-02-11 08:57:35' where idAdsList=1;

function zeroS(s: string) {
  return s.length < 2 ? '0' + s : s;
}
export function convertAvitoAbsoluteDate(dObj: { absoluteDate: string; relativeDate: string }): string {
  const dateString = dObj.absoluteDate;
  const [day, month, time] = dateString.split(' ');
  const [hour, minute] = time.split(':');

  let year = new Date().getFullYear();
  const monthCurrent = new Date().getMonth();
  if (month === 'декабря' && monthCurrent === 0) year -= 1; // если январь - то декабрь в прошлом году

  // '2023-02-11 08:57:35'
  return `${year}-${months[month]}-${zeroS(day)} ${zeroS(hour)}:${zeroS(minute)}:00`;
}

// console.log(ConvertAvitoAbsoluteDate({ absoluteDate: '8 февраля 20:59', relativeDate: '' }));

export function convertNumberToMySQLTimestamp(n: number): string {
  // '2023-02-11 08:57:35'
  return dayjs(n * 1000).format('YYYY-MM-DD HH:mm:ss');
}

// console.log(new Date().getTime());
// 1680515313
// 1678802852501
// console.log(convertNumberToMySQLTimestamp(new Date().getTime()));
// console.log(convertNumberToMySQLTimestamp(1680515313));
