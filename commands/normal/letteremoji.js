const charEmojiMap = {
	"a": "🅰", "b": "🅱", "c": "©", "d": "↩", "e": "📧", "f": "🎏", "g": "⛽",
	"h": "♓", "i": "ℹ", "j": () => Math.random() < .5 ? "🌶" : "🗾", "k": "🎋", "l": "👢", "m": "Ⓜ",
	"n": "♑", "o": () => Math.random() < .5 ? "⭕" : "🔅", "p": "🅿", "q": "📯", "r": "®", "s": () => Math.random() < .5 ? "💲" : "⚡",
	"t": "🌴", "u": "⛎", "v": () => Math.random() < .5 ? "🖖🏼" : "♈", "w": () => Math.random() < .7 ? "〰" : "📈", "x": () => Math.random() < .5 ? "❌" : "⚔", "y": "✌",
	"z": "Ⓩ", "1": "1⃣", "2": "2⃣", "3": "3⃣", "4": "4⃣", "5": "5⃣",
	"6": "6⃣", "7": "7⃣", "8": "8⃣", "9": "9⃣", "0": "0⃣", "$": "💲", "!": "❗", "?": "❓", " ": "　"
};

module.exports = {
	desc: "Search on the ~~urban~~ wiki for the 'best' answers",
	usage: "<search>",
	task(bot, msg, suffix) {
		var search = msg.content.split(" ").slice(1).join("+");
		var apiURL = "http://api.urbandictionary.com/v0/define?term=" + search;
		request(apiURL, function (error, response, body) {
			if (error) {
				console.error(error);
			}
			if (!error && response.statusCode == 200) {
				body = JSON.parse(body);
				if (body.list.length === 0) {
					bot.createMessage(msg.channel.id, "Your search for **\"" + suffix + "\"** no results, **" + msg.author.username + "-senpai** :cry:");
				} else {
					var result = body.list[Math.floor(Math.random() * (body.list.length))]
					var toSend = "**" + result.word + "** by *" + result.author + "*\n\n";
					toSend += result.definition;
					toSend += "\n\n*" + result.example + "*";
					toSend += "\n\n👍" + result.thumbs_up + " : 👎" + result.thumbs_down;
					bot.createMessage(msg.channel.id, toSend);
				}
			}
		});
	}
};
