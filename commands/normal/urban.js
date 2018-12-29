var request = require("request");

module.exports = {
	desc: "Search on the ~~urban~~ wiki for the 'best' answers",
	usage: "<search>",
	task(bot, msg, suffix) {
		var search = msg.content.split(" ").slice(1).join("+"),
        apiURL = `http://api.urbandictionary.com/v0/define?term=${search}`;
		request(apiURL, function (error, response, body) {
			if (error) {
				console.error(error);
			}
			if (!error && response.statusCode == 200) {
				body = JSON.parse(body);
				if (body.list.length === 0) {
					bot.createMessage(msg.channel.id, `Your search for **${suffix}** no results, **${msg.author.username}** :cry:`);
				} else {
					var result = body.list[Math.floor(Math.random() * (body.list.length))];
          bot.createMessage(msg.channel.id, { content: undefined,
            embed: {
                description: `**${result.word}** by *${result.author}*`,
                fields: [
                  {name: 'Definition', value: `${result.definition}`, inline: false},
                  {name: 'Example', value: `${result.example}\n\n👍 ${result.thumbs_up}  |  👎 ${result.thumbs_down}`, inline: false},
                ]
            }
          });
				}
			}
		});
	}
};
