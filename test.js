// const moment = require('moment');

// console.log(moment().format())
// console.log(moment().utc().add(7, 'hours').format())

let mode = 0;
// Install moment-timezone: npm install moment-timezone
const moment = require('moment-timezone');

// Get the current local time
const timezone = "Asia/Ho_Chi_Minh";
const targetTime = '09:00:00'; // 9 AM

// Get the current time in the specified timezone
const currentDateTime = moment().tz(timezone);

// Compare the current time with the target time
const isPastTargetTime = currentDateTime.isAfter(moment(targetTime, 'HH:mm:ss'));

console.log(currentDateTime);
// Check and print the result
if (isPastTargetTime) {
  console.log('It is past 9 AM in UTC+7.');
} else {
  console.log('It is not past 9 AM in UTC+7.');
}