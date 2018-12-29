module.exports = {
	desc: "Gives/Removes you the role to mention you inside KawaiiBot / Bytr Hangour",
	usage: "[subscribe|unsubscribe]",
	task(bot, msg, suffix) {
		function announcement_reaction() {
			if (msg.channel.guild.members.get(bot.user.id).permission.json.manageRoles) {
				var member;
				var roles;
				if (suffix == "subscribe") {
					member = msg.channel.guild.members.get(msg.author.id),
						roles = member.roles;
					roles.push(role_id);
					bot.editGuildMember(msg.channel.guild.id, msg.author.id, {
						roles: roles
					});
					bot.createMessage(msg.channel.id, `**${msg.author.username}**, you have successfully subscribed :cookie:`)
				} else if (suffix == "unsubscribe") {
					member = msg.channel.guild.members.get(msg.author.id),
						roles = member.roles;
					roles.splice(roles.indexOf(role_name), 1);
					bot.editGuildMember(msg.channel.guild.id, msg.author.id, {
						roles: roles
					});
					bot.createMessage(msg.channel.id, `**${msg.author.username}**, you have successfully unsubscribed :cookie:`)
				} else return 'wrong usage';
			} else bot.createMessage(msg.channel.id, `**${msg.author.username}** I need \`manageRoles\` permission to do this...`)
		}

		if (msg.channel.guild.id == "226959018722066432") { //Festive Community
			var role_name = "updates",
				role_id = "230760174535573504";
			announcement_reaction();
			return;
		}
		bot.createMessage(msg.channel.id, `Maybe try this command inside **KawaiiBot / Bytr Hangout** server?`)
	}
};