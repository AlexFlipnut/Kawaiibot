var reload = require('require-reload'),
	setAvatar = reload('../../utils/utils.js').setAvatar,
	settingsManager = reload('../../utils/settingsManager.js');

module.exports = {
	desc: "Kicks a member from your server",
	usage: "<@user>",
	guildOnly: true,
  requiredPermission: 'kickMembers',
	task(bot, msg, suffix) {
		let banEventChannel = await(settingsManager.getEventSetting(msg.channel.guild.id, 'userbanned'));
		if (msg.channel.guild.members.get(bot.user.id).permission.json.kickMembers) {
	    if (msg.mentions.length > 0) {
	      bot.kickGuildMember(msg.channel.guild.id, msg.mentions[0].id);
	      bot.createMessage(msg.channel.id, `Kicked 👢 👌`);
				if (banEventChannel !== null) {
					bot.createMessage(banEventChannel, { content: '',
						embed: {
								color: 0xF1C40F,
								description: `👢 **User Kicked:** ${msg.mentions[0].username}#${msg.mentions[0].discriminator} (${msg.mentions[0].id})`
						}
					});
				}
	    } else return 'wrong usage';
		} else bot.createMessage(msg.channel.id, "⚠ I'm missing the permission `kickMembers`")
	}
};
