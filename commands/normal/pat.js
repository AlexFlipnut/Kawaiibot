var request = require("request");

module.exports = {
	desc: "Pat someone for the lolz",
	usage: "<@user>",
  aliases: ['pet'],
	cooldown: 5,
	task(bot, msg) {
		if (msg.mentions.length === 1) {
      bot.sendChannelTyping(msg.channel.id);
			if (msg.author.id == msg.mentions[0].id) {
        request({ url: "https://cdn.discordapp.com/attachments/255973925769445376/257112367362473985/source.gif", encoding: null }, (err, response) => {
					if (err) {
						bot.createMessage(msg.channel.id, "Error: " + err, function (erro, wMessage) {
							bot.deleteMessages(wMessage, {"wait": 8000});
						}); return;
					}
					if (response.statusCode != 200) {
						bot.createMessage(msg.channel.id, "Got status code " + response.statusCode, function (erro, wMessage) {
							bot.deleteMessages(wMessage, { "wait": 8000 });
						}); return;
					}
					bot.createMessage(msg.channel.id, ``, {
						file: response.body, name: 'alone.gif'
					});
				});
			} else if (msg.mentions[0].id == bot.user.id) {
        request({ url: "https://cdn.discordapp.com/attachments/255973925769445376/257106344782462976/0uEf8Pz.gif", encoding: null }, (err, response) => {
					if (err) {
						bot.createMessage(msg.channel.id, "Error: " + err, function (erro, wMessage) {
							bot.deleteMessages(wMessage, {"wait": 8000});
						}); return;
					}
					if (response.statusCode != 200) {
						bot.createMessage(msg.channel.id, "Got status code " + response.statusCode, function (erro, wMessage) {
							bot.deleteMessages(wMessage, { "wait": 8000 });
						}); return;
					}
					bot.createMessage(msg.channel.id, ``, {
						file: response.body, name: 'hmm.gif'
					});
				});
			} else {
				bot.sendChannelTyping(msg.channel.id);
				var gifs = [
					"https://cdn.discordapp.com/attachments/255973925769445376/257106361416941568/F8HxGo2.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106381931413504/acckcc_e1_p2.gif",
					"https://cdn.discordapp.com/attachments/250627433345187840/279399233784774656/petkanna.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106428710354944/tumblr_mkt8lsn4En1rbyttso1_500.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106442178265088/tumblr_mckmheJJAZ1rqw7udo1_500.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106443159732224/laEy6LU.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106451187630080/tumblr_nye403CPrW1uqe0lgo1_500.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106456078319616/source_1.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106462742937600/tumblr_m2g6iquLat1qbyrbao1_500.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106478098415616/85777dd28aa87072ee5a9ed759ab0170b3c60992_hq.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106480078127114/LRDanyb.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106483752206336/giphy_1.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106513686953984/USPKzuA.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106517352775681/zIw5Ddp.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106520024678400/wF1ohrH.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106521043894272/kyoukai-no-kanata-ending-1.gif",
          "https://cdn.discordapp.com/attachments/255973925769445376/257106560751239169/giphy_3.gif"
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
					bot.createMessage(msg.channel.id, `**${msg.mentions[0].username}**, you got a pat from **${msg.author.username}**`, {
						file: response.body,
						name: 'pat.gif'
					});
				});
			}
		} else return 'wrong usage';
	}
};
