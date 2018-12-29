module.exports = {
	desc: "Echo",
	usage: "<text>",
	requiredPermission: "manageGuild",
	task(bot, msg, suffix) {
		if (suffix) {
			bot.createMessage(msg.channel.id, `💬 ${suffix}`);
		} else return 'wrong usage';
	}
};