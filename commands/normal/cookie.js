module.exports = {
	desc: "Mention someone and give a cookie",
	usage: "<@user> [reason]",
	guildOnly: true,
	task(bot, msg, suffix) {
		if (msg.mentions.length === 1) {
			if (msg.author.id == msg.mentions[0].id) {
				bot.createMessage(msg.channel.id, `You can't give yourself cookies..`)
			} else if (msg.mentions[0].id == bot.user.id) {
				bot.createMessage(msg.channel.id, `I already have too many cookies, no thanks ;-;`)
			} else {
				var banMessage = suffix.replace(/<@\!?[0-9]+>/g, "").trim();
				if (!banMessage) bot.createMessage(msg.channel.id, `**${msg.mentions[0].username}** you got a 🍪 from **${msg.author.username}**\n\n(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ 🍪`);
				else bot.createMessage(msg.channel.id, `** ${msg.mentions[0].username},** you got a 🍪 from **${msg.author.username}**\n\n**Reason: **${banMessage}\n(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ 🍪`);
			}
		} else return 'wrong usage';
	}
}
