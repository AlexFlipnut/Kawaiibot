var utils = require("../../utils/utils.js");

module.exports = {
	desc: "Get your information or someone else's about when you/other guy joined",
	usage: "<@user>",
	guildOnly: true,
	aliases: ['ja'],
	task(bot, msg, suffix) {
		var userToGet;
		if (!suffix) {
			userToGet = msg.member;
		} else {
			userToGet = utils.getUserFromName(msg, suffix);
			if (userToGet == undefined || null) return;
			userToGet = bot.guilds.get(msg.channel.guild.id).members.get(userToGet.id);
		}
		bot.createMessage(msg.channel.id, { content: '',
			embed: {
					color: 0x14BAE4,
					description: `**${userToGet.user.username}#${userToGet.user.discriminator}** joined **${msg.channel.guild.name}**\n${new Date(userToGet.joinedAt).toUTCString()}`,
					thumbnail: {
						url: userToGet.user.avatarURL
					},
				}
		});
	}
};
