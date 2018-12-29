var utils = require("../../utils/utils.js");

module.exports = {
	desc: "Get your information or someone else's",
	usage: "<user>",
	guildOnly: true,
	aliases: ['u'],
	task(bot, msg, suffix) {
		var userToGet;
		if (!suffix) {
			userToGet = msg.member;
		} else {
			userToGet = utils.getUserFromName(msg, suffix);
			if (userToGet == undefined || null) return;
			userToGet = bot.guilds.get(msg.channel.guild.id).members.get(userToGet.id);
		}

		var sharedServers = bot.guilds.filter(g => typeof g.members.get(userToGet.user.id) !== `undefined`).length
		var sharedServersList = bot.guilds.filter(g => g.members.has(userToGet.user.id)).map(sg => sg.name).join(', ')
		var sharedListToogle, star;
		if (sharedServers < 5) {
			star = "⭐"
		} else if (sharedServers > 5) {
			star = "🌟"
		} else star = "🌟"

		if (sharedServers < 20) {
			sharedListToogle = sharedServersList
		} else if (sharedServers > 20) {
			sharedListToogle = "There are too many servers to show all of them... ;-;"
		} else sharedListToogle = "There are too many servers to show all of them... ;-;"

		bot.createMessage(msg.channel.id, { content: '',
			embed: {
					color: 0x14BAE4,
					description: `${star} I share **${sharedServers}** servers with **${userToGet.user.username}#${userToGet.user.discriminator}**\n${sharedListToogle}`,
					thumbnail: {
						url: userToGet.user.avatarURL
					},
				}
		});
	}
};
