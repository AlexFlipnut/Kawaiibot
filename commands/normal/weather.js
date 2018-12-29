const request = require("request")
const emojiFlags = require("emoji-flags")
const config = require("../../config.json")

const OWM_API_KEY = config.weather_api_key;

function timeConverter (UNIX_timestamp) {
  let a = new Date(UNIX_timestamp * 1000),
      hour = a.getHours(),
      min = a.getMinutes(),
      sec = a.getSeconds(),
      time = `${hour}:${min}:${sec}`
  return time;
}

const conditionMap = {
	'01d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/72x72/2600.png', //Sun
	'02d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/72x72/26c5.png', //Partly sunny
	'03d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/72x72/2601.png', //Cloud
	'04d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f327.png', //Cloud rain
	'09d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f327.png', //Cloud rain
	'10d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f326.png', //Sun and rain cloud
	'11d': 'https://cdn.discordapp.com/attachments/132632676225122304/270190320736534538/emoji.png', //Thunder and rain
	'13d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f328.png', //Cloud snow
	'50d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f32b.png', //Fog
	'01n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f311.png', //New moon
	'02n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/72x72/26c5.png', //Partly sunny
	'03n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/72x72/2601.png', //Cloud
	'04n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f327.png', //Cloud rain
	'09n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f327.png', //Cloud rain
	'10n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f326.png', //Sun and rain cloud
	'11n': 'https://cdn.discordapp.com/attachments/132632676225122304/270190320736534538/emoji.png', //Thunder and rain
	'13n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f328.png', //Cloud snow
	'50n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f32b.png', //Fog
}

module.exports = {
	desc: "Get the weather of your request",
	usage: "<city|country>",
	task(bot, msg, suffix) {
		if (OWM_API_KEY == null || OWM_API_KEY == "")
			return msg.channel.createMessage("⚠ No API key defined by bot owner")

		if (suffix) suffix = suffix.replace(" ", "");
		let rURL = (/\d/.test(suffix) == false) ? `http://api.openweathermap.org/data/2.5/weather?q=${suffix}&APPID=${OWM_API_KEY}` : `http://api.openweathermap.org/data/2.5/weather?zip=${suffix}&APPID=${OWM_API_KEY}`;

		request(rURL, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				body = JSON.parse(body);
				if (!body.hasOwnProperty("weather")) return // console.log("no")

				let tempF = `${Math.round(parseInt(body.main.temp) * (9 / 5) - 459.67)} °F`,
						tempC = `${Math.round(parseInt(body.main.temp) - 273.15)} °C`,
						windspeedUS = Math.round(parseInt(body.wind.speed) * 2.23694) + " mph",
						windspeed = body.wind.speed + " m/s",
						icon = conditionMap[body['weather'][0]['icon']];

				try {
					msg.channel.createMessage({ content: undefined,
						embed: {
								description: `${emojiFlags.countryCode(body.sys.country).emoji} Weather from **${body.name}**`,
								thumbnail: {
									url: icon
								},
								fields: [
									{name: 'Weather', value: `${body.weather[0].main}\n(${body.weather[0].description})`, inline: true},
									{name: 'Sunrise & Sunset (UTC)', value: `${timeConverter(body.sys.sunrise)} | ${timeConverter(body.sys.sunset)}`, inline: true},
									{name: 'Wind', value: `${windspeed} | ${windspeedUS}`, inline: true},
									{name: 'Temperature', value: `${tempC} | ${tempF}`, inline: true},
									{name: 'Humidity', value: `${body.main.humidity}%`, inline: true},
									{name: 'Cloudiness', value: `${body.clouds.all}%`, inline: true},
								]
							}
					})
				} catch (error) {
					msg.channel.createMessage('Something went wrong...')
					console.error(error.stack)
				}
				
			} else {
				msg.channel.createMessage(`Could not find any results... try again`)
			}
		});
	}
}
