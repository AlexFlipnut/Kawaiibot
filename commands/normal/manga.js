var config = require("../../config.json"),
	ent = require("entities"),
	request = require("request"),
	xml2js = require("xml2js");

const MAL_USER = config.mal_user;
const MAL_PASS = config.mal_pass;

module.exports = {
	desc: "Gets details on a manga from MAL.",
	usage: "<manga/novel name>",
	cooldown: 6,
	task(bot, msg, suffix) {
		if (suffix) {
			if (!MAL_USER || !MAL_PASS || MAL_USER == "" || MAL_PASS == "") {
				bot.createMessage(msg.channel.id, "MAL login not configured by bot owner", function (erro, wMessage) {
					bot.deleteMessage(wMessage, {
						"wait": 8000
					});
				});
				return;
			}
			var tags = ent.encodeHTML(suffix);
			var rUrl = "http://myanimelist.net/api/manga/search.xml?q=" + tags;
			request(rUrl, {
				"auth": {
					"user": MAL_USER,
					"pass": MAL_PASS,
					"sendImmediately": false
				}
			}, function (error, response, body) {
				if (error) console.error(error.stack);
				else if (!error && response.statusCode == 200) {
					xml2js.parseString(body, function (err, result) {
						var title = result.manga.entry[0].title;
						var english = result.manga.entry[0].english;
						var chapters = result.manga.entry[0].chapters;
						var volumes = result.manga.entry[0].volumes;
						var score = result.manga.entry[0].score;
						var type = result.manga.entry[0].type;
						var status = result.manga.entry[0].status;
						var synopsis = result.manga.entry[0].synopsis.toString();
						var id = result.manga.entry[0].id;
						synopsis = synopsis.replace(/<br \/>/g, " ").replace(/\[(.{1,10})\]/g, "").replace(/\r?\n|\r/g, " ").replace(/\[(i|\/i)\]/g, "*").replace(/\[(b|\/b)\]/g, "**");
						synopsis = ent.decodeHTML(synopsis);
						if (!msg.channel.isPrivate) {
							if (synopsis.length > 400) synopsis = synopsis.substring(0, 400) + "...";
						}
						bot.createMessage(msg.channel.id, ":notebook_with_decorative_cover: **" + title + " / " + english + "**\n**Type:** " + type + " **| Chapters:** " + chapters + " **| Volumes: **" + volumes + " **| Status:** " + status + " **| Score:** " + score + "\n" + synopsis + "\n**http://www.myanimelist.net/manga/" + id + "**");
					});
				} else bot.createMessage(msg.channel.id, "\"" + suffix + "\" not found", function (erro, wMessage) {
					bot.deleteMessage(wMessage, {
						"wait": 8000
					});
				});
			});
		} else return 'wrong usage';
	}
};