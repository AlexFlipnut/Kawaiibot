module.exports = {
	desc: "Bans a member from your server",
	usage: "<@user|userID>",
	guildOnly: true,
	requiredPermission: 'banMembers',
	task(bot, msg, suffix) {
		if (!msg.channel.guild.members.get(bot.user.id).permission.json.banMembers)
			return msg.channel.createMessage("⚠ I'm missing the permission `banMembers`");

		function banUser(target) {
			bot.banGuildMember(msg.channel.guild.id, target, 0)
	      .then(() => { msg.channel.createMessage(`Successfully banned the user :hammer:`) })
	      .catch(error => msg.channel.createMessage(`Error: ${JSON.parse(error.response).message}`))
		}

		if (msg.mentions.length > 0)
			banUser(msg.mentions[0].id);
		else if (msg.mentions.length == 0)
			banUser(suffix);
		else
			return 'wrong usage';

	}
};
