var reload = require("require-reload"),
	formatTime = reload("../../utils/utils.js").formatTime,
	version = reload("../../package.json").version,
	Nf = new Intl.NumberFormat("en-US");

module.exports = {
	desc: "Displays statistics about the bot.",
	hidden: true,
	guildOnly: true,
	cooldown: 10,
	aliases: ["s"],
	requiredPermission: "manageGuild",
	task(bot, msg) {
		process.retrieve("_evaluateAll", `${getStats.toString()}\ngetStats()`).then(rawStats => {
			let stats = {};

			for (const key of Object.keys(rawStats[0])) {
				if (typeof rawStats[0][key] === "number") {
					stats[key] = rawStats.map(s => s[key]).reduce((a, b) => a + b);
				}
			}

			bot.createMessage(msg.channel.id, {
				content: "",
				embed: {
					color: 0xFFA8F4,
					// title: 'ℹ Statistics:',
					description: "ℹ Statistics:",
					fields: [
						{ name: "Uptime", value: `${formatTime(stats.uptime)}`, inline: true },
						{ name: "Memory Usage", value: `${Math.round(process.memoryUsage().rss / 1024 / 1000)}MB`, inline: true },
						{ name: "Version", value: `v${version}`, inline: true },
						{ name: "Shards", value: `${stats.shards}`, inline: true },
						{ name: "[ Guilds | Channels | Users ]", value: `${Nf.format(stats.guilds)} | ${Nf.format(stats.channels)} | ${Nf.format(stats.users)}`, inline: true },
						{ name: "Average Users/Guild", value: `${Nf.format(stats.userGuilds.toFixed(2))}`, inline: true },
						{ name: "[ Total | Commands | Cleverbot ]", value: `${Nf.format(stats.totalCommands)} | ${Nf.format(stats.commands)} | ${Nf.format(stats.cleverbots)}`, inline: true },
						{ name: "Average", value: `${stats.average.toFixed(2)} commands/min`, inline: true }
					],
					footer: {
						icon_url: "https://cdn.discordapp.com/attachments/242673287639990273/248503133632856066/230254711956045824.png",
						text: "A Kawaii bot :3"
					}
				}
			}); // End of stats message
		});
	}
};

function getStats() {
	return {
		uptime: bot.uptime,
		shards: bot.shards.size,
		guilds: bot.guilds.size,
		channels: Object.keys(bot.channelGuildMap).length,
		users: bot.users.size,
		userGuilds: bot.users.size / bot.guilds.size,
		totalCommands: commandsProcessed + cleverbotTimesUsed,
		commands: commandsProcessed,
		cleverbots: cleverbotTimesUsed,
		average: (commandsProcessed + cleverbotTimesUsed) / (bot.uptime / (1000 * 60))
	};
}
