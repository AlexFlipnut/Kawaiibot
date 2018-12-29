
const libVersion = require('../../node_modules/eris/package.json').version,
	botVersion = require('../../package.json').version;

var config = require('../../config.json');

module.exports = {
	desc: "Tells you about the bot.",
	cooldown: 5,
	aliases: ['info', 'kawaiibot'],
	task(bot, msg) {
		bot.createMessage(msg.channel.id, { content: `ℹ __About **KawaiiBot** v${botVersion}__`,
			embed: {
					thumbnail: {
						url: bot.user.avatarURL
					},
					fields: [
						{name: 'Developers', value: `SplitPixl, stupid cat\nAurieh, Luna`, inline: true},
						{name: 'Support KawaiiBot', value: `[Patreon](https://www.patreon.com/KawaiiBot)`, inline: true},
						{name: 'Total servers/guilds', value: `${bot.guilds.size}`, inline: true},
						{name: 'Library', value: `Eris v${libVersion}`, inline: true},
						{name: 'Bot Server', value: `http://discord.gg/kawaii`, inline: true},
						{name: 'Shards', value: `${config.shardCount}`, inline: true},
					]
				}
		});
	}
};
