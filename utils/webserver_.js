var reload = require('require-reload')
var _Logger = reload('../utils/Logger.js')
var formatTime = reload('../utils/utils.js').formatTime
var config = require("../config.json");
const hbs = require("handlebars");
var fs = require("fs")
var logger
const os = require("os");
var path = require('path');
const eris = require("eris");
const express = require('express')
var bodyParser = require('body-parser')
const app = express();
const port = 8091;

var authTemplate = hbs.compile(String(fs.readFileSync("./utils/auth.hbs")));

module.exports = function(manager) {
	var bot = new eris(manager.options.token, {
		disableEveryone: true,
		disableEvents: {
			MESSAGE_CREATE: true,
			MESSAGE_DELETE: true,
			MESSAGE_DELETE_BULK: true,
			MESSAGE_UPDATE: true,
			PRESENCE_UPDATE: true,
			TYPING_START: true,
			VOICE_STATE_UPDATE: true,
		},
		getAllUsers: config.client.fetchAllUsers,
		maxShards: os.cpus().length,
		messageLimit: 0,
	});

	bot.connect();

	bot.on("ready", () => {
		logger.logWithHeader('READY', 'bgGreen', 'black', 'Webserver Client ready!');
	});

	app.use('/', express.static(path.join(__dirname, 'website')));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.get("/overview", (request, response) => {
		response.header("Content-Type", "application/json");
		response.header("Access-Control-Allow-Origin", "*");
		response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

		if (!bot.ready) return response.json({error: "Bot client not yet ready.."});

		let uptime = formatTime(manager.uptime);
		let commandsProcessed;
		let cleverbotTimesUsed;
		let memUsage;
		let lastUpdated = Date.now();
		manager.broadcastEval("commandsProcessed")
			.then(processed => {
				commandsProcessed = Number(processed.reduce((a, b) => a + b));
				return manager.broadcastEval("cleverbotTimesUsed");
			})
			.then(cleverbot => {
				cleverbotTimesUsed = Number(cleverbot.reduce((a, b) => a + b));
				return manager.broadcastEval("Math.round(process.memoryUsage().rss / 1024 / 1000)");
			})
			.then(mem => {
				memUsage = Number(mem.reduce((a, b) => a + b)) + Math.round(process.memoryUsage().rss / 1024 / 1000);
				let totalCommandUsage = commandsProcessed + cleverbotTimesUsed;
				let avgCommandUsage = (totalCommandUsage / (manager.uptime / (1000 * 60))).toFixed(2);
				let toSend = {
					"serverCount": bot.guilds.size,
					"userCount": bot.users.size,
					"totalCommands": totalCommandUsage,
					"avgCommands": avgCommandUsage,
					"lastUpdated": lastUpdated,
					"memoryUsage": memUsage,
					"uptime": uptime
				};
				response.json(toSend);
			})
	}); // TODO: gotta use sse.js, maybe soon:tm:
	app.get("/invite", (request, response) => {
		response.redirect(301, "https://discordapp.com/oauth2/authorize?&client_id=195244341038546948&scope=bot")
	});

	app.get("/auth", (request, response) => {
		if (request.query.guild_id) {
			var guild = bot.guilds.get(String(request.query.guild_id));
			if (!guild) return response.send("Invalid guild...Pls no exploits kthxbai")
			var guildicon = guild.iconURL;
			var guildname = guild.name;
			var toSend;
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
			response.redirect(307, "https://discordapp.com/oauth2/authorize?&client_id=195244341038546948&scope=bot")
		}
	})

	const server = app.listen(port, (err) => {
		if (err) {
			return console.error('something bad happened', err.stack)
		}
		/*
		var sse_server = new SSE(server);
		sse_server.on("connection", (client) => {
			const listenForGuilds = () => {
				client.send({type: "GUILD_CREATE", count: bot.guilds.size});
			};

		});*/
		if (logger === undefined)
			logger = new _Logger(config.logTimestamp);
		logger.logWithHeader('READY', 'bgGreen', 'black', 'Webserver running!');
	})
}
