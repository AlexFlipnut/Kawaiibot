var yargs = require('yargs'),
	request = require("request"),
	cheerio = require("cheerio");

module.exports = {
	desc: "Gets details on an anime character from MAL. Do ``+anichar --help`` for more info",
	usage: "<character name> [--help] [--anime] <anime name>",
	cooldown: 6,
	task(bot, msg, suffix) {
		if (suffix) {
			//add function for recent and popular, if both aren't set then do default recent
			var argv = yargs.parse(suffix);
			var strSearch = argv._.join('+');
			if (argv.h || argv.help) {
				var helpMsg = [];
				helpMsg.push(":information_source: **Anime Character Search Help**\n");
				helpMsg.push("**Usage**: ``+anichar <character name> [--anime] <\"anime name\">``");
				helpMsg.push("▪``--help / -h`` | Display this help");
				helpMsg.push("▪``--anime <\"anime name\">`` | Filters characters starring in this anime. Enclose the name in quotes.");
				bot.createMessage(msg.channel.id, helpMsg);
				return;
			} else {
				var bFilter = false;
				if (argv.anime) bFilter = !bFilter;

				var MALURL = "http://www.myanimelist.net";
				var rUrl = MALURL + "/character.php?q=" + strSearch;

				request(rUrl, function (error, response, html) {
					if (!error && response.statusCode == 200) {
						var $ = cheerio.load(html);
						var charas = [];
						$('tr').each(function (idx) {
							if (idx != 0) {
								var a = $(this).
								children().first(). //<td>
								children().first(). //<div>
								children().first().attr('href'); //<a>
								//http://www.myanimelist.net/character/117873/Mira_Yurizaki
								var chara_url = MALURL + a;
								var chara_animeslist = $(this).children().last().text().trim();
								var bFound = true;
								chara_animeslist = chara_animeslist.substr(0, "Anime: ".length) + "\n -" + chara_animeslist.substr("Anime: ".length);

								if (bFilter) {
									bFound = false;
									var strFilter = argv.anime;
									//console.log(strFilter.toLowerCase());
									if (chara_animeslist.toLowerCase().indexOf(strFilter.toLowerCase(), 0) > -1) {
										bFound = true;
									}
								}

								if (bFound) {
									var character_data = {
										chara_imgurl: chara_url,
										chara_name: $(this).children().first().next().text().trim(),
										chara_animes: chara_animeslist
									};
									charas.push(character_data);
								}
							}
						});

						if (charas.length > 0) {
							bot.createMessage(msg.channel.id, ":notebook_with_decorative_cover: \n**| Name:** " +
								charas[0].chara_name +
								"\n**| Appeared In:** \n- " +
								charas[0].chara_animes.replace(/, /g, "\n- ") +
								"\n**| More: **" +
								charas[0].chara_imgurl);
						} else {
							bot.createMessage(msg.channel.id, "I-I-Its not my fault your waifu or husbando couldn't be found! Blame the MAL database!");
						}

					}
				});
			}
		} else return 'wrong usage';
	}
};