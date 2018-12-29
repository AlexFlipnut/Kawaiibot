const { formatFlags } = require("../../utils/Formatter");

module.exports = {
	desc: "Prunes the specified number of messages from the channel.",
	usage: "<1-100>",
	guildOnly: true,
	requiredPermission: 'manageMessages',
	task(bot, msg, suffix) {
		if (!msg.channel.guild.members.get(bot.user.id).permission.json.manageMessages) {
			bot.createMessage(msg.channel.id, "⚠ I'm missing the permission `manageMessages`");
			return;
		}

		let args = suffix.split(" ");
		let limit = Number(args.shift().replace(/\D/gm, ""));
		if (isNaN(limit)) limit = 100;
		let flags = formatFlags(args);
		let channel = (byChannel)?byChannel:msg.channel.id;
		if (!Object.keys(flags).length) {
			bot.purgeChannel(channel, limit)
				.then(() => {
					bot.createMessage(msg.channel.id, `🚮 Deleted ${limit} messages\n(Activated by: ${msg.author.username}#${msg.author.discriminator})`)
				}, err => {
					console.error(err);
					bot.createMessage(msg.channel.id, "An error occured while trying to delete the messages...");
				});
		}
		let byUser = (flags["user"] instanceof String ? /^\d+$/.test(flags["user"]) : Number(flags["user"].replace(/\D/gm, ""))) || null;
		let byChannel = (flags["channel"] instanceof String ? /^\d+$/.test(flags["channel"]) : Number(flags["channel"].replace(/\D/gm, ""))) || null;
		let byContent = flags["includes"] || flags["content"] || null;
		let ifBot = flags["bot"]?true:null;
		const check = (msg) => {
			if (byUser && msg.author.id === byUser) return true;
			if (byContent && msg.content.indexOf(byContent)) return true;
			if (ifBot && msg.author.bot) return true;
			return false;
		}

		bot.purgeChannel(channel, limit, check)
			.then(() => {
				bot.createMessage(msg.channel.id, `🚮 Deleted ${limit} messages\n(Activated by: ${msg.author.username}#${msg.author.discriminator})`)
			}, err => {
				console.error(err);
				bot.createMessage(msg.channel.id, "An error occured while trying to delete the messages...");
			});
	}
};
