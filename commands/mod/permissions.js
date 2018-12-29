module.exports = {
	desc: "Checks permissions on server",
	usage: "",
  aliases: ['access'],
	guildOnly: true,
	task(bot, msg, suffix) {
    var getBot = bot.guilds.get(msg.channel.guild.id).members.get(bot.user.id);
		bot.createMessage(msg.channel.id, { content: '',
			embed: {
				color: 0xF1C40F,
				description: `Permission: ${getBot.permission.allow}\nhttps://discordapi.com/permissions.html#${getBot.permission.allow}`
			}
	  });
	}
};
