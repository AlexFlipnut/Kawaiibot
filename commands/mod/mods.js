module.exports = {
	desc: "Check who is online of the moderators (Source by stupid cat#8160)",
	usage: "",
	guildOnly: true,
	task(bot, msg, suffix) {
		function isStaff(m) {
			return (m.permission.has('kickMembers') ||
				m.permission.has('banMembers') ||
				m.permission.has('administrator') ||
				m.permission.has('manageChannels') ||
				m.permission.has('manageGuild') ||
				m.permission.has('manageMessages'));
		}

		function getName(member) {
			return `${member.user.username}#${member.user.discriminator}`;
		}

		try {
			var includeOffline = true;
			if (suffix && suffix.toLowerCase() == 'online') {
				includeOffline = false;
			}
			var mods = msg.channel.guild.members.filter(m => {
				return !m.user.bot && isStaff(m) &&
					(includeOffline || m.status == 'online');
			});
			var maxLength = 0;
			mods.forEach(m => {
				if (getName(m).length > maxLength) {
					maxLength = getName(m).length;
				}
			});
			var message = '';
			mods.forEach(m => {
				message += `${(m.status == 'online'
				? '<:vpOnline:212789758110334977>'
				: (m.status == 'idle'
					? '<:vpAway:212789859071426561>'
											: (m.status == 'dnd'
											? '<:vpDnD:236744731088912384>'
							: '<:vpOffline:212790005943369728>')))} **${getName(m)}**\n`;
			});
			bot.createMessage(msg.channel.id, `Mods in **${msg.channel.guild.name}**\n${message}`);
		} catch (err) {
			console.error(err.stack);
		}
	}
};