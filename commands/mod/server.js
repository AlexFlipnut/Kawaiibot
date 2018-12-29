module.exports = {
	desc: "Displays information about the current server or your searched one",
	usage: "<server>",
	cooldown: 5,
	guildOnly: true,
	task(bot, msg, suffix) {
		if (suffix) {
			var server = bot.guilds.filter(m => m.name == suffix || m.id == suffix),
					bots = server[0].members.filter(user => user.user.bot).length,
        	people = server[0].members.size - bots;
			bot.createMessage(msg.channel.id, { content: `ℹ Information about an other server`,
				embed: {
						thumbnail: {
							url: `${server[0].iconURL}`
						},
						fields: [
							{name: 'Server Name', value: `${server[0].name}`, inline: true},
							{name: 'Server ID', value: `${server[0].id}`, inline: true},
							{name: 'Total members', value: `${server[0].memberCount}`, inline: true},
							{name: 'Bots', value: `${bots} | ${((bots / server[0].memberCount) * 100).toFixed(2)}%`, inline: true},
							{name: 'Owner', value: `${server[0].members.get(server[0].ownerID).user.username}#${server[0].members.get(server[0].ownerID).user.discriminator}`, inline: true},
							{name: 'Default channel', value: `#${server[0].defaultChannel.name}\n( ${server[0].defaultChannel.id} )`, inline: true},
							{name: 'Created', value: `${new Date(server[0].createdAt)}`, inline: true},
							{name: 'Region', value: `${server[0].region}`, inline: true},
						]
					}
			});
		} else {
			bot.createMessage(msg.channel.id, { content: `ℹ Information about this server`,
				embed: {
						thumbnail: {
							url: `${msg.channel.guild.iconURL}`
						},
						fields: [
							{name: 'Server Name', value: `${msg.channel.guild.name}`, inline: true},
							{name: 'Server ID', value: `${msg.channel.guild.id}`, inline: true},
							{name: 'Total members', value: `${msg.channel.guild.memberCount}`, inline: true},
							{name: 'Owner', value: `${msg.channel.guild.members.get(msg.channel.guild.ownerID).user.username}#${msg.channel.guild.members.get(msg.channel.guild.ownerID).user.discriminator}`, inline: true},
							{name: 'Default channel', value: `#${msg.channel.guild.defaultChannel.name}\n( ${msg.channel.guild.defaultChannel.id} )`, inline: true},
							{name: 'Created', value: `${new Date(msg.channel.guild.createdAt)}`, inline: true},
							{name: 'Region', value: `${msg.channel.guild.region}`, inline: true},
						]
					}
			});
		}
	}
};
