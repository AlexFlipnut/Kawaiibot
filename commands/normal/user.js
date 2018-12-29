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

		var roleNames = userToGet.roles.map(r => msg.channel.guild.roles.get(r).name)
		var sharedServers = bot.guilds.filter(g => typeof g.members.get(userToGet.user.id) !== `undefined`).length || 'None'

		bot.createMessage(msg.channel.id, { content: ``,
			embed: {
					color: 0x2196F3,
					thumbnail: {
						url: userToGet.user.avatarURL
					},
					fields: [
						{name: 'Username', value: `${userToGet.user.username}#${userToGet.user.discriminator}`, inline: true},
						{name: 'Nickname', value: `${userToGet.nick || 'No nickname'}`, inline: true},
						{name: 'User ID', value: `${userToGet.user.id}`, inline: true},
						{name: 'Shared with KawaiiBot', value: `${sharedServers}`, inline: true},
						{name: 'Account created', value: `${new Date((userToGet.user.id / 4194304) + 1420070400000).toUTCString()}`, inline: true},
						{name: `Joined ${msg.channel.guild.name}`, value: `${new Date(userToGet.joinedAt).toUTCString()}`, inline: true},
						{name: 'Roles', value: `[${roleNames.length}] (${roleNames.join(', ')})`, inline: true},
						//{name: 'Avatar', value: `${userToGet.user.avatarURL}`, inline: true},
					]
				}
		});
	}
};
