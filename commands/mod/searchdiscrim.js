module.exports = {
	desc: "Search for a discriminators around other servers KawaiiBot can see",
	guildOnly: true,
	cooldown: 10,
	hidden: true,
	task(bot, msg, suffix) {
		if (suffix.length != 4) suffix = msg.author.discriminator;
		if (!/^\d+$/.test(suffix)) suffix = msg.author.discriminator;
		var usersCache = [];
		bot.users.forEach(user => {
			if (user.discriminator === suffix) usersCache.push(user)
		})
		if (usersCache.length < 1) var msgString = "```markdown\n### No Users Found: (" + suffix + ") ###";
		else {
			var msgString = "```markdown\n### Found These User(s): (" + suffix + ") ###";
			for (i = 0; i < usersCache.length; i++) {
				if (i === 10) {
					msgString += "\nAnd " + (usersCache.length - i) + " more users...";
					break;
				}
				msgString += "\n[" + (i + 1) + "]: " + usersCache[i].username;
			}
		}
		bot.createMessage(msg.channel.id, msgString + "```");
	}
};
