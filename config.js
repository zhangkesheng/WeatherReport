config = {
  ACCESS_KEY_ID: 'ACCESS_KEY_ID',
  SERECT_ACCESS_KEY: 'SERECT_ACCESS_KEY',
  SIGN_NAME: 'namd',
  TEMPLATE_CODE: 'TEMPLATE_CODE',
  TARGET_PHONE: 'TARGET_PHONE',
  REMIND_TIME:'REMIND_TIME',
  REMIND_TIME_WEEKEND:'REMIND_TIME_WEEKEND',
  APP_CODE: 'APP_CODE',
  CITY_ID: 'CITY_ID'
}

module.exports = (() => {

  if (process.env.ACCESS_KEY_ID != undefined) {
    config.ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
  }

  if (process.env.SERECT_ACCESS_KEY != undefined) {
    config.SERECT_ACCESS_KEY = process.env.SERECT_ACCESS_KEY;
  }

  if (process.env.SIGN_NAME != undefined) {
    config.SIGN_NAME = process.env.SIGN_NAME;
  }
  if (process.env.TEMPLATE_CODE != undefined) {
    config.TEMPLATE_CODE = process.env.TEMPLATE_CODE;
  }
  
  if (process.env.TARGET_PHONE != undefined) {
    config.TARGET_PHONE = process.env.TARGET_PHONE;
  }
  if (process.env.REMIND_TIME != undefined) {
    config.REMIND_TIME = process.env.REMIND_TIME;
  }
  if (process.env.REMIND_TIME_WEEKEND != undefined) {
    config.REMIND_TIME_WEEKEND = process.env.REMIND_TIME_WEEKEND;
  }
  
  if (process.env.APP_CODE != undefined) {
    config.APP_CODE = process.env.APP_CODE;
  }
  if (process.env.CITY_ID != undefined) {
    config.CITY_ID = process.env.CITY_ID;
  }
  return config
})()
