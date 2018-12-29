module.exports = async function(bot, settingsManager, _config, guild, member) {
	let leaveEventChannel = await(settingsManager.getEventSetting(guild.id, 'memberleft'));
	if (leaveEventChannel !== null)
		bot.createMessage(leaveEventChannel, { content: '',
			embed: {
					color: 0xE74C3C,
					description: `📤 **User Left** \`[${new Date().toLocaleString()}]\`
<@!${member.user.id}> | ${member.user.username}#${member.user.discriminator} (${member.user.id})`
			}
		});
}
