module.exports = {
	desc: "Search for a servers KawaiiBot can see",
	guildOnly: true,
	cooldown: 10,
	hidden: true,
	task(bot, msg, suffix) {
		if (suffix) {
			var nameRegex = new RegExp(suffix, "i");
			var serverCache = [];
			bot.guilds.forEach(guild => {
				if (nameRegex.test(guild.name)) serverCache.push(guild);
			})
			if (serverCache.length < 1) {
				bot.createMessage(msg.channel.id, "```markdown\n### No Servers Found ###```")
				return;
			}
			var msgString = ["```markdown\n### Found These servers(s): ###"];
			for (i = 0; i < serverCache.length; i++) {
				if (i === 25) {
					msgString += "\nAnd " + (serverCache.length - i) + " more servers...";
					break;
				}
				var bots = serverCache[i].members.filter(user => user.user.bot).length;
				var people = serverCache[i].members.size - bots;
				msgString += "\n[" + (i + 1) + "]: " + serverCache[i].name + " - " + bots + "/" + people + " " + ((bots / serverCache[i].members.size) * 100).toFixed(2) + "%";
			}
			bot.createMessage(msg.channel.id, msgString + "```");
		} else return 'wrong usage';
	}
};
