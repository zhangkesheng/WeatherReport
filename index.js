const schedule = require("node-schedule");
const request = require('request');
const SMSClient = require('@alicloud/sms-sdk')
const config = require('./config')

const ACCESS_KEY_ID = config.ACCESS_KEY_ID;
const SERECT_ACCESS_KEY = config.SERECT_ACCESS_KEY
const SIGN_NAME = config.SIGN_NAME;
const TEMPLATE_CODE = config.TEMPLATE_CODE;
const TARGET_PHONE = config.TARGET_PHONE;
const APP_CODE = config.APP_CODE;
const CITY_ID = config.CITY_ID;

console.log("配置文件如下\n%s\n",JSON.stringify(config, null, "\t"))

var skyconMap = new Map();
skyconMap.set("CLEAR_DAY","晴天");
skyconMap.set("CLEAR_NIGHT","晴夜");
skyconMap.set("PARTLY_CLOUDY_DAY","多云");
skyconMap.set("PARTLY_CLOUDY_NIGHT","多云");
skyconMap.set("CLOUDY","阴");
skyconMap.set("RAIN","雨");
skyconMap.set("SNOW","雪");
skyconMap.set("WIND","风");
skyconMap.set("FOG","雾");
skyconMap.set("HAZE","霾");
skyconMap.set("SLEET","冻雨");

var getweather = async (token, longitude, latitude) => {
    url = 'https://api.caiyunapp.com/v2/' + token + '/' + longitude + ',' + latitude + '/realtime'
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            weather = JSON.parse(body);
            result = {
                temperature: weather.result.temperature,
                pm25: weather.result.pm25,
                skycon: skyconMap.get(weather.result.skycon)
            }
            console.log("天气状况\n%s\n",JSON.stringify(result, null, "\t"))
            say(TARGET_PHONE,JSON.stringify(result))
        }
    })
}

//今天${city}天气: ${weather}. 温度: ${templow}至${temphigh}. 平均气温: ${temp}. 风速: ${windpower}. tips: ${notice}
var aliyunWeather=async (appCode, cityId)=>{
	url = 'http://jisutqybmf.market.alicloudapi.com/weather/query?cityid=' + cityId
	var options = {
		url: url,
		headers: {
			'Authorization': 'APPCODE '+ appCode
		}
	};
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            weather = JSON.parse(body);
			console.log("get weather result: %s",JSON.stringify(weather, null, "\t"))
            result = {
				city: weather.result.city,
				weather: weather.result.weather,
				templow: weather.result.templow,
				temphigh: weather.result.temphigh,
				temp: weather.result.temp,
				windpower: weather.result.windpower,
				notice: "爱你的老公"
            }
            console.log("天气状况\n%s\n",JSON.stringify(result, null, "\t"))
            say(TARGET_PHONE,JSON.stringify(result))
        }
    })
}

//工作日配置
var ruleWork = new schedule.RecurrenceRule();
ruleWork.dayOfWeek = [new schedule.Range(1, 5)];
ruleWork.hour = config.REMIND_TIME.split(':')[0];
ruleWork.minute = config.REMIND_TIME.split(':')[1];
var j = schedule.scheduleJob(ruleWork, function () {
	console.log("当前短信发送时间",getNowFormatDate())
	aliyunWeather(APP_CODE,CITY_ID)
});

//双休日配置
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, 6];
rule.hour = config.REMIND_TIME_WEEKEND.split(':')[0];
rule.minute = config.REMIND_TIME_WEEKEND.split(':')[1];
var j = schedule.scheduleJob(rule, function () {
	console.log("当前短信发送时间",getNowFormatDate())
	aliyunWeather(APP_CODE,CITY_ID)
});

console.log("每日发送时间%s:%s",ruleWork.hour,rule.minute)
console.log("当前脚本运行时间",getNowFormatDate())
	
function say(phone, param) {
    const accessKeyId = ACCESS_KEY_ID
    const secretAccessKey = SERECT_ACCESS_KEY
    let smsClient = new SMSClient({ accessKeyId, secretAccessKey })
    smsClient.sendSMS({
        PhoneNumbers: phone,
        SignName: SIGN_NAME,
        TemplateCode: TEMPLATE_CODE,
        TemplateParam: param
    }).then(function (res) {
        let { Code } = res
        if (Code === 'OK') {
            console.log(JSON.stringify(res, null, "\t"))
        }
    }, function (err) {
        console.log(JSON.stringify(err, null, "\t"))
    })
}


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}