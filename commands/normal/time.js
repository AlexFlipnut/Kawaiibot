const moment = require('moment-timezone');

function prettyDate(date) {
	try {
		return date.getUTCFullYear() + "-" + ("0" + (date.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + date.getUTCDate()).slice(-2) + " " + ("0" + date.getUTCHours()).slice(-2) + ":" + ("0" + date.getUTCMinutes()).slice(-2) + ":" + ("0" + date.getUTCSeconds()).slice(-2) + " UTC";
	} catch (err) {
		console.error(err);
	}
}


var unirest = require("unirest");

module.exports = {
	desc: "Get the time of the place you wish",
	usage: "<adress|ZIP code|city|country>",
	task(bot, msg, suffix) {
		var location = suffix;

		if (location.indexOf("in ") == 0) {
			location = suffix.substring(3);
		}
		if (!location) {
			bot.createMessage(msg.channel.id, "It's **" + prettyDate(new Date()) + "** where I am");
			return;
		}
		unirest.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURI(location.replace(/&/g, '')))
			.header("Accept", "application/json")
			.end(function (result) {
				if (result.status == 200 && result.body.results.length > 0) {
					location = result.body.results[0].formatted_address;
					unirest.get("https://maps.googleapis.com/maps/api/timezone/json?location=" + result.body.results[0].geometry.location.lat + "," + result.body.results[0].geometry.location.lng + "&timestamp=865871421&sensor=false")
						.header("Accept", "application/json")
						.end(function (result) {
							var date = moment().tz(result.body.timeZoneId).format('YYYY-MM-DD HH:mm:ss');
							console.dir(result);
						//	var date = new Date(Date.now() + (parseInt(result.body.rawOffset) * 1000) + (parseInt(result.body.dstOffset) * 1000));
							bot.createMessage(msg.channel.id, "**" + date + "**\n     " + location + " (" + result.body.timeZoneName + ")");
						});
				} else {
					bot.createMessage(msg.channel.id, `wew **${msg.author.username}**... I can't find this place called **${suffix}**`);
				}
			});
	}
};
