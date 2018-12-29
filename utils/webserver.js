var reload = require('require-reload')
var _Logger = reload('../utils/Logger.js')
var formatTime = reload('../utils/utils.js').formatTime
var config = require("../config.json")
var fs = require("fs")
var logger
var path = require('path');
const express = require('express')
var bodyParser = require('body-parser')
const hbs = require("handlebars");
const app = express()
const port = 8096

var authTemplate = hbs.compile(String(fs.readFileSync("./utils/auth.hbs")));

module.exports = function (bot) {
	app.use('/', express.static(path.join(__dirname, 'website')));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.get('/overview', (request, response) => {
		response.header("Content-Type", "application/json");
		response.header("Access-Control-Allow-Origin", "*");
		response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

		var totalCommandUsage = commandsProcessed + cleverbotTimesUsed;
		var avgCommandUsage = (totalCommandUsage / (bot.uptime / (1000 * 60))).toFixed(2);
		var lastUpdated = Date.now();
		var memoryUsage = `${Math.round(process.memoryUsage().rss / 1024 / 1000)} MB `;
		var uptime = formatTime(bot.uptime);

		var toSend = {
			"serverCount": bot.guilds.size,
			"userCount": bot.users.size,
			"totalCommands": totalCommandUsage,
			"avgCommands": avgCommandUsage,
			"lastUpdated": lastUpdated,
			"memoryUsage": memoryUsage,
			"uptime": uptime
		};
		response.send(JSON.stringify(toSend))
	})

	app.get("/invite", (request, response) => {
		response.redirect(301, "https://discordapp.com/oauth2/authorize?client_id=195244341038546948&scope=bot")
	});

	app.get("/auth", (request, response) => {
		if (request.query.guild_id) {
      let guild = bot.guilds.get(request.query.guild_id);
      if (!guild) return response.send("no u");
      let guildname = guild.name;
      let guildicon = guild.iconURL;
      let toSend;
      if (guildicon) {
				toSend = authTemplate({
					icon_url: guildicon,
					server_name: guildname
				});
				response.send(toSend)
			} else {
				toSend = authTemplate({
					guild_icon: "images/unknown.png",
					server_name: guildname
				});
				response.send(toSend)
			}
		} else {
			response.redirect(307, "https://discordapp.com/oauth2/authorize?client_id=195244341038546948&scope=bot")
		}
	})
	app.get("/stats/raw", (req, res) => {
		var statsJSON = {
			guilds: bot.guilds.size,
			users: bot.users.size,
			uptime: bot.uptime,
			//shards: bot.shards.map(o => {"id": o.id "status": o.status, "guilds": o.guildCount)
		}
		res.json(statsJSON)
	})
	app.listen(port, (err) => {
		if (err) {
			return console.error('Webserver Error: ', err.stack)
		}
		if (logger === undefined)
			logger = new _Logger(config.logTimestamp);
		logger.logWithHeader('READY', 'bgGreen', 'black', 'Webserver running!');
	})
}
