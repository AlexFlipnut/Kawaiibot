module.exports = {
	desc: "Displays information about the current channel",
	usage: "<server>",
	cooldown: 5,
	guildOnly: true,
	task(bot, msg, suffix) {
		let overwrites = msg.channel.permissionOverwrites;
        let allowed = [];
        let final = [];
        let roles = [];
        overwrites.map((o) => {
            if (o.has('readMessages')) allowed.push(o);
        });
        for (let i = 0; i < allowed.length; i++) {
            if (allowed[i].type === 'user') {
                final.push(bot.users.find((u) => u.id === allowed[i].id));
            } else if (allowed[i].type === 'role') {
                roles.push(msg.guild.roles.find((r) => r.id === allowed[i].id));
            }
        }
        if (roles.length > 0) {
            for (let i = 0; i < roles.length; i++) {
                msg.guild.members.map(m => {
                    for (let x = 0; x < m.roles.length; x++) {
                        if (m.roles[x] === roles[i].id) {
                            final.push(m);
                        }
                    }
                });
            }
        }
        if (final.length > 0) {
            usersallowed = final.length - 1
        } else {
            usersallowed = msg.guild.memberCount
        }

		bot.createMessage(msg.channel.id, { content: `ℹ Information about <#${msg.channel.id}>`,
			embed: {
					thumbnail: {
						url: `${msg.channel.guild.iconURL}`
					},
					fields: [
						{name: 'Name', value: `${msg.channel.name}`, inline: true},
            {name: 'Topic', value: `${msg.channel.topic}`, inline: true},
						{name: 'ID', value: `${msg.channel.id}`, inline: true},
            {name: 'Created', value: `${new Date(msg.channel.createdAt)}`, inline: true},
						{name: 'Users allowed', value: `${usersallowed}`, inline: true},
					]
				}
		});
	}
};
