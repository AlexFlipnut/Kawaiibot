var request = require("request");

module.exports = {
	desc: "Convert between currencies",
	usage: "<amount> <CODE> to <CODE>",
	task(bot, msg, suffix) {
		if (!suffix)
			return 'wrong usage';
		else {
			let parsed = suffix.match(/(\d+\.?\d?\d?) ?([a-zA-Z]{3}).*([a-zA-Z]{3})$/);
			if (!parsed || parsed.length !== 4) return 'wrong usage';
			else {
				request(`https://www.google.com/finance/converter?a=${parsed[1]}&from=${parsed[2]}&to=${parsed[3]}`, (err, res, body) => {
					if (err) bot.createMessage(msg.channel.id, err);
					if (res.statusCode != 200) bot.sendMessage(msg, `Got response code ${res.statusCode}`);
					else {
						let result = body.match(/<span class=bld>(.+?)<\/span>/gmi) || ["Error: Value code invalid"];
						bot.createMessage(msg.channel.id, `${parsed[1]} ${parsed[2]} is equal to ${result[0].replace(/<\/?span( class=bld)?>/g, '')}`);
					}
				});
			}
		}
	}
}