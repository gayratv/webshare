/*

1675453943 1970-01-20T09:24:13.943Z
1676361462 1970-01-20T09:39:21.462Z
1675454262 1970-01-20T09:24:14.262Z
1000001674547045

*/
import dayjs from 'dayjs';

// Assuming that this timestamp is in seconds:
console.log(new Date(1675454262 * 1000).toLocaleString());

// Assuming that this timestamp is in microseconds (1/1,000,000 second):
console.log(new Date(1674547045 * 1000).toLocaleString());
console.log(new Date(9999999999 * 1000).toLocaleString());
console.log(new Date(1000001674547045).toLocaleString());
console.log(new Date(1674547045 * 1000).toLocaleString());
/*

// This is implemented as dayjs(timestamp * 1000), so partial seconds in the input timestamp are included.
console.log('', dayjs.unix(1318781876).format());
console.log('   ', dayjs(1318781876406).format());
console.log(dayjs.unix(1000001674547045).format());
*/
