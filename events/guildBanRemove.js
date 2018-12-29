module.exports = async function(bot, settingsManager, _config, guild, user) {
	let unbanEventChannel = await(settingsManager.getEventSetting(guild.id, 'userunbanned'));
	if (unbanEventChannel !== null)
		bot.createMessage(unbanEventChannel, { content: '',
			embed: {
					color: 0x2ECC71,
					description: `🍪 **User Unbanned:** ${user.username}#${user.discriminator} (${user.id})`
			}
		});
}
