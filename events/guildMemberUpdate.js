module.exports = async function(bot, settingsManager, _config, guild, member, oldMember) {
	if (oldMember && member.nick !== oldMember.nick) {
		let nickEventChannel = await(settingsManager.getEventSetting(guild.id, 'nicknamechanged'));
		if (nickEventChannel !== null) {
			if (member.nick !== null)
				bot.createMessage(nickEventChannel, `\`[${new Date().toLocaleString()}]\` **Nickname Change:**\n\`\`${member.user.username}\`\` is now nicknamed \`\`${member.nick}\`\``);
			else
				bot.createMessage(nickEventChannel, `\`[${new Date().toLocaleString()}]\` **Nickname Change:**\n\`\`${member.user.username}\`\` removed their nickname`);
		}
	}
}