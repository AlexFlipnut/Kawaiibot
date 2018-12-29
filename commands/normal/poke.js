var request = require("request");

module.exports = {
	desc: "Poke someone for the lolz",
	usage: "<@user>",
	cooldown: 5,
	task(bot, msg) {
		if (msg.mentions.length === 1) {
			if (msg.author.id == msg.mentions[0].id) {
				bot.createMessage(msg.channel.id, `Don't poke yourself...`)
			} else if (msg.mentions[0].id == bot.user.id) {
				bot.createMessage(msg.channel.id, `Don't poke me ;-;`)
			} else {
				var gifs = [
					"https://media.giphy.com/media/WvVzZ9mCyMjsc/giphy.gif",
					"http://i.myniceprofile.com/797/79743.gif",
					"https://s-media-cache-ak0.pinimg.com/originals/f1/ed/b1/f1edb10d35692b40ec28eeddbd6b0dd4.gif",
					"http://orig01.deviantart.net/d0f6/f/2013/262/6/7/sneezing_fennekin__2__anime_trailer__animated__by_furry_sneezes-d6mylfo.gif",
					"https://cdn.discordapp.com/attachments/255973925769445376/257433870289469440/13ce3dddf97ab9d02f1bdc3b6c2f31190c2013b8_hq.gif"
				];
				var url = `${gifs[Math.floor(gifs.length * Math.random())]}`
				request({
					url: url,
					encoding: null
				}, (err, response) => {
					if (err) {
						bot.createMessage(msg.channel.id, "Error: " + err, function (erro, wMessage) {
							bot.deleteMessages(wMessage, {
								"wait": 8000
							});
						});
						return;
					}
					if (response.statusCode != 200) {
						bot.createMessage(msg.channel.id, "Got status code " + response.statusCode, function (erro, wMessage) {
							bot.deleteMessages(wMessage, {
								"wait": 8000
							});
						});
						return;
					}
					bot.createMessage(msg.channel.id, `**${msg.mentions[0].username}**, you got poked by **${msg.author.username}**`, {
						file: response.body,
						name: 'poke.gif'
					});
				});
			}
		} else return 'wrong usage';
	}
};
