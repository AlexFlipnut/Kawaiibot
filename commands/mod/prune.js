const { formatFlags } = require("../../utils/Formatter");
const linkRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/gm;

module.exports = {
	desc: "Prunes the specified number of messages from the channel.",
	usage: "<1-100> [--user <ID | mention> --includes <string> --bot --file --channel <ID | mention> --links]",
	guildOnly: true,
	requiredPermission: 'manageMessages',
	task(bot, msg, suffix) {
		if (!msg.channel.guild.members.get(bot.user.id).permission.json.manageMessages) {
			bot.createMessage(msg.channel.id, "⚠ I'm missing the permission `manageMessages`");
			return;
		}

		let args = suffix.split(" ");
		let limit = Number(args.shift().replace(/\D/gm, ""));
		if (limit < 1 || limit > 100) return "wrong usage";
		if (isNaN(limit)) limit = 100;
		let flags = formatFlags(args);
		let byChannel = (typeof flags["channel"] === "string") ? flags["channel"].replace(/\D/gm, "") : null
		let channel = (byChannel)?byChannel:msg.channel.id;
		if (!Object.keys(flags).length) {
			bot.purgeChannel(channel, limit+1, (m) => m.id !== msg.id)
				.then((deletedMessages) => {
					bot.createMessage(msg.channel.id, `🚮 Deleted ${deletedMessages} message(s)`)
				}, err => {
					console.error(err.stack);
					bot.createMessage(msg.channel.id, "An error occured while trying to delete the messages...");
				});
			return;
		}
		let byUser = (typeof flags["user"] === "string") ? flags["user"].replace(/\D/gm, "") : null
		let byContent = flags["includes"] || flags["content"] || null;
		let ifFile = flags["file"] || null;
		let ifBot = flags["bot"]?true:null;
		let ifLinks = flags["links"] || flags["url"] || flags["urls"] || null;
		const check = (m) => {
                        if (m.id === msg.id) return false;
			if (byUser && m.author.id == byUser) return true;
			if (byContent && ~m.content.indexOf(byContent)) return true;
			if (ifBot && m.author.bot) return true;
			if (ifFile && m.attachments.length > 0) return true;
			if (ifLinks && linkRegex.test(m.content)) return true;
			return false;
		}

		bot.purgeChannel(channel, limit+1, check)
			.then((deletedMessages) => {
                                if (deletedMessages === 0) return bot.createMessage(msg.channel.id, "🚮 Deleted 0 messages, all clean anyway 👌");
				bot.createMessage(msg.channel.id, `🚮 Deleted ${deletedMessages} message(s)`)
			}, err => {
				console.error(err.stack);
				bot.createMessage(msg.channel.id, "An error occured while trying to delete the messages...");
			});
	}
}
