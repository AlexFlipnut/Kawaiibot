var reload = require('require-reload'),
	_Logger = reload('../utils/Logger.js'),
	logger;

module.exports = async function(bot, _settingsManager, config, guild) {
	if (logger === undefined)
		logger = new _Logger(config.logTimestamp);
	logger.logWithHeader('JOINED GUILD', 'bgGreen', 'black', `${guild.name} owned by ${guild.members.get(guild.ownerID).user.username}`);
	if (config.bannedGuildIds.includes(guild.id)) {
		logger.logWithHeader('LEFT BANNED GUILD', 'bgRed', 'black', guild.name);
		guild.leave();
	} else
		bot.createMessage(guild.defaultChannel.id, "t-this seems like a nice place, thanks for bringing me in :3\nYou can do \`+help\` to see my commands, but if you need more help, or want to hangout, join here **<https://discord.gg/kawaii>** ❤");
}
