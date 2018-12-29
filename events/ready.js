var Nf = new Intl.NumberFormat("en-US"),
	reload = require("require-reload"),
	_Logger = reload("../utils/Logger.js"),
	webserver = reload("../utils/webserver.js"),
	logger;

module.exports = function(bot, config, games) {
	if (logger === undefined)
		{logger = new _Logger(config.logTimestamp);}
	bot.shards.forEach(shard => {
		let name = games[~~(Math.random() * games.length)];
		shard.editStatus("online", {
			name: name
		});
	});

	logger.logWithHeader("READY", "bgGreen", "black", `S:${Nf.format(bot.guilds.size)} U:${Nf.format(bot.users.size)} AVG:${Nf.format((bot.users.size / bot.guilds.size).toFixed(2))}`);
};
