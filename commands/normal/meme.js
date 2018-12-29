var request = require("request");

var meme_list = "tenguy, afraid, older, aag, tried, biw, blb, kermit, bd, ch, cbg, wonka, cb, keanu, dsm, live, ants, doge, alwaysonbeat, ermg, facepalm, fwp, fa, fbf, fmr, fry, ggg, hipster, icanhas, crazypills, mw, noidea, regret, boat, hagrid, sohappy, captain, inigo, iw, ackbar, happening, joker, ive, ll, morpheus, badchoice, mmm, jetpack, red, mordor, oprah, oag, remembers, philosoraptor, jw, sad-obama, sad-clinton, sadfrog, sad-joe-biden, i'm-so-sorry, dwight, ss, sf, money, dodgson, officespace, interesting, toohigh, winter, buzz, yuno, bad";

module.exports = {
	desc: "Make a ~~dank~~ meme",
	usage: "(list|symbols|show) <meme> | <top> | <bottom>",
	cooldown: 3,
	task(bot, msg, suffix) {
		var url;
		if (suffix == "list") {
			bot.getDMChannel(msg.author.id).then(pc => {
				bot.createMessage(pc.id, `**Memes I can do so far:**\n${meme_list}\n\nUse \`+meme show\` to preview the memes`);
				bot.createMessage(msg.channel.id, `Sent a PM with all the memes I can do 📬`)
			})
		} else if (suffix == "symbols") {
			bot.createMessage(msg.channel.id, `**Symboles for le memes:**\n_ → space | -- → -\n~q → ? | ~p → %\n~h → # | ~s → /\n'' → "`)
		} else if (suffix.indexOf("show") == 0) {
			let meme = suffix.split('show')[1];
			suffix = suffix.substr(suffix.indexOf('show')).trim()
			suffix = suffix.replace("show", "").trim();
			if (meme) {
				url = `https://memegen.link/${meme}/_/_.jpg`;
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
					bot.createMessage(msg.channel.id, '', {
						file: response.body,
						name: 'woop_meme.jpg'
					});
				});
			} else bot.createMessage(msg.channel.id, `Try this methode:\n\`+meme show [meme]\``)
		} else {
			let meme = suffix.split('|')[0];
			let over = suffix.split('|')[1];
			let under = suffix.split('|')[2];
			suffix = suffix.substr(suffix.indexOf('|')).trim()
			suffix = suffix.replace("|", "").trim();
			if (meme && over && under && suffix) {
				url = `https://memegen.link/${meme}/${over}/${under}.jpg?font=impact`;
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
					bot.createMessage(msg.channel.id, '', {
						file: response.body,
						name: 'woop_meme.jpg'
					});
				});
			} else return 'wrong usage';
		}
	}
};
