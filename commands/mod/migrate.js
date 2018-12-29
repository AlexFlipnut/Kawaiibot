let genericSettings = require('../../db/genericSettings.json')
let reminders = require('../../db/reminders.json')
let commandSettings = require('../../db/commandSettings.json')

module.exports = {
	desc: "Migrates the configs to rethinkdb",
	usage: "",
	hidden: true,
	ownerOnly: true,
	task: async function (bot, msg) {
		let msg2 = await (bot.createMessage(msg.channel.id, 'I will now begin to migrate the configs. I will ping you when I\'m done.'))
		await (r.table('guild').delete().run())
		let guilds = {};
		let guildsToPush = [];
		for (let guild in commandSettings) {
			if (!guilds.hasOwnProperty(guild)) guilds[guild] = {};
			guilds[guild].channelIgnores = commandSettings[guild].channelIgnores || undefined;
			guilds[guild].userIgnores = commandSettings[guild].userIgnores || undefined;
			guilds[guild].guildIgnores = commandSettings[guild].guildIgnores || undefined;
		}
		for (let guild in genericSettings) {
			if (!guilds.hasOwnProperty(guild)) guilds[guild] = {};
			guilds[guild].events = genericSettings[guild].events || undefined;
			guilds[guild].welcome = genericSettings[guild].welcome || undefined;
			guilds[guild].nsfw = genericSettings[guild].nsfw || undefined;
		}
		for (let guild in guilds) {
			guilds[guild].guildId = guild;
			guildsToPush.push(guilds[guild]);
		}
		await (r.table('guild').insert(guildsToPush).run())
		await (r.table('reminders').delete().run());
		let remindersToPush = [];
		for (let time in reminders) {
			remindersToPush.push({
				timestamp: r.epochTime(time / 1000),
				userId: reminders[time].user,
				text: reminders[time].text
			});
		}
		await (r.table('reminders').insert(remindersToPush).run())
		msg2.edit(`Hey, ${msg.author.mention}! I'm finished!`);
	}
}