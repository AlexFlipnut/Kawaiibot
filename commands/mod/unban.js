module.exports = {
	desc: "Unbans a member from your server",
	usage: "<userID>",
	guildOnly: true,
	requiredPermission: 'banMembers',
	task(bot, msg, suffix) {
		if (!msg.channel.guild.members.get(bot.user.id).permission.json.banMembers)
			return msg.channel.createMessage("⚠ I'm missing the permission `banMembers`");

		bot.unbanGuildMember(msg.channel.guild.id, suffix)
	    .then(() => { msg.channel.createMessage(`Successfully unbanned the ID`) })
	    .catch(error => msg.channel.createMessage(`Error: ${JSON.parse(error.response).message}`))
	}
};
