var utils = require("../../utils/utils.js");

module.exports = {
	desc: "Get your avatar or someone else's",
  usage: "<@user>",
	task(bot, msg, suffix) {
		var userToGet;
		if (!suffix) {
				userToGet = msg.member;
		} else {
				userToGet = utils.getUserFromName(msg, suffix);
				if (userToGet == undefined || null) return;
				userToGet = bot.guilds.get(msg.channel.guild.id).members.get(userToGet.id);
		}
		msg.channel.createMessage({ content: ``,
			embed: {
				description: `Avatar to **${userToGet.user.username}#${userToGet.user.discriminator}**\nClick [here](${userToGet.user.avatarURL.slice(0, -3)}1024) to get the image`,
				image: {
					url: `${userToGet.user.avatarURL.slice(0, -3)}1024`
				}
			}
		});
	}
};
