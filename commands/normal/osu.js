var osuapi = require("osu-api"),
  request = require("request"),
  config = require("../../config.json");
const OSU_API_KEY = config.osu_api_key;

module.exports = {
  desc: "Checks information regarding Osu",
  usage: "[mode] sig [username] [hex color] | [mode] <user|best|recent> [username]",
  task(bot, msg, suffix) {
    if (!suffix) {
      return "wrong usage";
    }

    var osu;
    var username;
    if (/^(osu!?)?(mania|taiko|ctb|catch the beat) .{3,6} /i.test(suffix)) {
      if (suffix.replace(/^(osu!?)?(mania|taiko|ctb|catch the beat) /i, "").startsWith("sig")) {
        if (/^(osu!?)?mania/i.test(suffix)) osu = "3";
        else if (/^(osu!?)?(ctb|catch the beat)/i.test(suffix)) osu = "2";
        else if (/^(osu!?)?taiko/i.test(suffix)) osu = "1";
      } else {
        if (!OSU_API_KEY || OSU_API_KEY == "") {
          bot.createMessage(msg.channel.id, "Osu API key not configured by bot owner", (erro, wMessage) => {
            bot.deleteMessage(wMessage, {
              wait: 8000
            });
          });
          return;
        }
        if (/^(osu!?)?mania/i.test(suffix)) osu = new osuapi.Api(OSU_API_KEY, osuapi.Modes.osumania);
        else if (/^(osu!?)?(ctb|catch the beat)/i.test(suffix)) osu = new osuapi.Api(OSU_API_KEY, osuapi.Modes.CtB);
        else if (/^(osu!?)?taiko/i.test(suffix)) osu = new osuapi.Api(OSU_API_KEY, osuapi.Modes.taiko);
      }
      suffix = suffix.replace(/^(osu!?)?(mania|taiko|ctb|catch the beat) /i, "");
    } else if (suffix.startsWith("sig")) osu = false;
			else {
				if (!OSU_API_KEY || OSU_API_KEY == "") {
					bot.createMessage(msg.channel.id, "Osu API key not configured by bot owner", (erro, wMessage) => {
						bot.deleteMessage(wMessage, {
							"wait": 8000
						});
					});
					return;
				}
				osu = new osuapi.Api(OSU_API_KEY);
			}

    if (suffix.split(" ")[0] === "sig") {
      var color = "ff66aa";
      username = msg.author.username;
      suffix = suffix.split(" ");
      suffix.shift();
      if (suffix && suffix.length >= 1) {
        if (/(.*) #?[A-Fa-f0-9]{6}$/.test(suffix.join(" "))) {
          username = suffix.join("%20").substring(0, suffix.join("%20").lastIndexOf("%20"));
          if (suffix[suffix.length - 1].length == 6) {
            color = suffix[suffix.length - 1];
          } else if (suffix[suffix.length - 1].length == 7) {
            color = suffix[suffix.length - 1].substring(1);
          }
        } else if (/#?[A-Fa-f0-9]{6}$/.test(suffix.join(" "))) {
          username = msg.author.username;
          if (suffix[0].length == 6) {
            color = suffix[0];
          } else if (suffix[0].length == 7) {
            color = suffix[0].substring(1);
          }
        } else {
          username = suffix.join("%20");
        }
      }
      var url = `https://lemmmy.pw/osusig/sig.php?colour=hex${  color  }&uname=${  username  }&pp=2&flagshadow&xpbar&xpbarhex&darktriangles`;
      if (osu) url += `&mode=${  osu}`;
      request({
        url: url,
        encoding: null
      }, (err, response) => {
        if (err) {
          bot.createMessage(msg.channel.id, `Error: ${  err}`, (erro, wMessage) => {
						bot.deleteMessage(wMessage, {
							"wait": 8000
						});
					});
          return;
        }
        if (response.statusCode != 200) {
          bot.createMessage(msg.channel.id, `Got status code ${  response.statusCode}`, (erro, wMessage) => {
						bot.deleteMessage(wMessage, {
							"wait": 8000
						});
					});
          return;
        }
        bot.createMessage(msg.channel.id, "", {
          file: response.body,
          name: "sig.png"
        });
      });
    } else if (suffix.split(" ")[0] == "user") {
      username = suffix.split(" ").length < 2 ? msg.author.username : suffix.substring(5);
      osu.getUser(username, (err, data) => {
        if (err) {bot.createMessage(msg.channel.id, "Error: " + err, function (erro, wMessage) {
					bot.deleteMessage(wMessage, {
						"wait": 8000
					});
				});}
        if (!data) {bot.createMessage(msg.channel.id, "User \"" + username + "\" not found", function (erro, wMessage) {
					bot.deleteMessage(wMessage, {
						"wait": 8000
					});
				});}
        else {
          if (data.playcount === null || data.playcount == 0) {
            bot.createMessage(msg.channel.id, "User has no data", (erro, wMessage) => {
              bot.deleteMessage(wMessage, {
                wait: 10000
              });
            });
            return;
          }
          var toSend = [];
          toSend.push(`User: ${  data.username.replace(/@/g, '@\u200b')  } (${  data.country  })`);
          toSend.push(`Play Count: ${  data.playcount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")  } | Level: ${  data.level.substring(0, data.level.split(".")[0].length + 3)}`);
          toSend.push(`Ranked Score: ${  data.ranked_score.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
          toSend.push(`Total Score: ${  data.total_score.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
          toSend.push(`PP: ${  data.pp_raw.split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
          toSend.push(`Rank: #${  data.pp_rank.replace(/\B(?=(\d{3})+(?!\d))/g, ",")  } (Country Rank: #${  data.pp_country_rank.replace(/\B(?=(\d{3})+(?!\d))/g, ",")  })`);
          toSend.push(`Accuracy: ${  data.accuracy.substring(0, data.accuracy.split(".")[0].length + 3)  }%`);
          toSend.push(`300s: ${  data.count300.replace(/\B(?=(\d{3})+(?!\d))/g, ",")  } | 100s: ${  data.count100.replace(/\B(?=(\d{3})+(?!\d))/g, ",")  } | 50s: ${  data.count50.replace(/\B(?=(\d{3})+(?!\d))/g, ",")  } | SS: ${  data.count_rank_ss  } | S: ${  data.count_rank_s  } | A: ${  data.count_rank_a.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
          bot.createMessage(msg.channel.id, `\`\`\`xl\n${  toSend.join('\n')  }\`\`\``);
        }
      });
    } else if (suffix.split(" ")[0] === "best") {
      username = suffix.split(" ").length < 2 ? msg.author.username : suffix.substring(5);
      osu.getUserBest(username, (err, data) => {
				if (err) {
					bot.createMessage(msg.channel.id, "Error: " + err, function (erro, wMessage) {
						bot.deleteMessage(wMessage, {
							"wait": 8000
						});
					});
					return;
				}
				if (!data || !data[0] || !data[1] || !data[2] || !data[3] || !data[4]) {
					bot.createMessage(msg.channel.id, "User \"" + username + "\" not found or user doesn't have 5 plays", function (erro, wMessage) {
						bot.deleteMessage(wMessage, {
							"wait": 8000
						});
					});
					return;
				}
				var toSend = [];
				toSend.push("```ruby\nTop 5 for " + username.replace(/@/g, '@\u200b') + ":");
				/** CODE:NOTE Welcome to callback hell :3 */
				osu.getBeatmap(data[0].beatmap_id, (err, map1) => {

					toSend.push("1.# " + map1.title + " (☆" + map1.difficultyrating.substring(0, map1.difficultyrating.split(".")[0].length + 3) + ")\n\tPP: " + Math.round(data[0].pp.split(".")[0]) + " | Rank: " + data[0].rank + " | Score: " + data[0].score.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Max Combo: " + data[0].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Misses: " + data[0].countmiss + " | Date: " + data[0].date);

					osu.getBeatmap(data[1].beatmap_id, (err, map2) => {

						toSend.push("2.# " + map2.title + " (☆" + map2.difficultyrating.substring(0, map2.difficultyrating.split(".")[0].length + 3) + ")\n\tPP: " + Math.round(data[1].pp.split(".")[0]) + " | Rank: " + data[1].rank + " | Score: " + data[1].score.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Max Combo: " + data[1].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Misses: " + data[1].countmiss + " | Date: " + data[1].date);

						osu.getBeatmap(data[2].beatmap_id, (err, map3) => {

							toSend.push("3.# " + map3.title + " (☆" + map3.difficultyrating.substring(0, map3.difficultyrating.split(".")[0].length + 3) + ")\n\tPP: " + Math.round(data[2].pp.split(".")[0]) + " | Rank: " + data[2].rank + " | Score: " + data[2].score.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Max Combo: " + data[2].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Misses: " + data[2].countmiss + " | Date: " + data[2].date);

							osu.getBeatmap(data[3].beatmap_id, (err, map4) => {

								toSend.push("4.# " + map4.title + " (☆" + map4.difficultyrating.substring(0, map4.difficultyrating.split(".")[0].length + 3) + ")\n\tPP: " + Math.round(data[3].pp.split(".")[0]) + " | Rank: " + data[3].rank + " | Score: " + data[3].score.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Max Combo: " + data[3].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Misses: " + data[3].countmiss + " | Date: " + data[3].date);

								osu.getBeatmap(data[4].beatmap_id, (err, map5) => {

									toSend.push("5.# " + map5.title + " (☆" + map5.difficultyrating.substring(0, map5.difficultyrating.split(".")[0].length + 3) + ")\n\tPP: " + Math.round(data[4].pp.split(".")[0]) + " | Rank: " + data[4].rank + " | Score: " + data[4].score.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Max Combo: " + data[4].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Misses: " + data[4].countmiss + " | Date: " + data[4].date);
									bot.createMessage(msg.channel.id, toSend.join("\n") + "```");
								});
							});
						});
					});
				});
			});
    } else if (suffix.split(" ")[0] === "recent") {
      username = suffix.split(" ").length < 2 ? msg.author.username : suffix.substring(7);
      osu.getUserRecent(username, (err, data) => {
				if (err) {
					bot.createMessage(msg.channel.id, "Error: " + err, function (erro, wMessage) {
						bot.deleteMessage(wMessage, {
							"wait": 8000
						});
					});
					return;
				}
				if (!data || !data[0]) {
					bot.createMessage(msg.channel.id, "User \"" + username + "\" not found or no recent plays", function (erro, wMessage) {
						bot.deleteMessage(wMessage, {
							"wait": 8000
						});
					});
					return;
				}
				var toSend = [];
				toSend.push("```ruby\n5 most recent plays for " + username.replace(/@/g, '@\u200b') + ":");
				osu.getBeatmap(data[0].beatmap_id, (err, map1) => {

					if (!map1 || !map1.title) {
						bot.createMessage(msg.channel.id, toSend + "```");
						return;
					}
					toSend.push("1.# " + map1.title + " (☆" + map1.difficultyrating.substring(0, map1.difficultyrating.split(".")[0].length + 3) + ")\n\tScore: " + data[0].score.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Rank: " + data[0].rank + " | Max Combo: " + data[0].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Misses: " + data[0].countmiss);
					if (!data[1]) {
						bot.createMessage(msg.channel.id, toSend.join("\n") + "```");
						return;
					}

					osu.getBeatmap(data[1].beatmap_id, (err, map2) => {

						if (!map2 || !map2.title) {
							bot.createMessage(msg.channel.id, toSend);
							return;
						}
						toSend.push("2.# " + map2.title + " (☆" + map2.difficultyrating.substring(0, map2.difficultyrating.split(".")[0].length + 3) + ")\n\tScore: " + data[1].score.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Rank: " + data[1].rank + " | Max Combo: " + data[1].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Misses: " + data[1].countmiss);
						if (!data[2]) {
							bot.createMessage(msg.channel.id, toSend.join("\n") + "```");
							return;
						}

						osu.getBeatmap(data[2].beatmap_id, (err, map3) => {

							if (!map3 || !map3.title) {
								bot.createMessage(msg.channel.id, toSend);
								return;
							}
							toSend.push("3.# " + map3.title + " (☆" + map3.difficultyrating.substring(0, map3.difficultyrating.split(".")[0].length + 3) + ")\n\tScore: " + data[2].score.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Rank: " + data[2].rank + " | Max Combo: " + data[2].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Misses: " + data[2].countmiss);
							if (!data[3]) {
								bot.createMessage(msg.channel.id, toSend.join("\n") + "```");
								return;
							}

							osu.getBeatmap(data[3].beatmap_id, (err, map4) => {

								if (!map4 || !map4.title) {
									bot.createMessage(msg.channel.id, toSend);
									return;
								}
								toSend.push("4.# " + map4.title + " (☆" + map4.difficultyrating.substring(0, map4.difficultyrating.split(".")[0].length + 3) + ")\n\tScore: " + data[3].score.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Rank: " + data[3].rank + " | Max Combo: " + data[3].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Misses: " + data[3].countmiss);
								if (!data[4]) {
									bot.createMessage(msg.channel.id, toSend.join("\n") + "```");
									return;
								}

								osu.getBeatmap(data[4].beatmap_id, (err, map5) => {

									if (!map5 || !map5.title) {
										bot.createMessage(msg.channel.id, toSend);
										return;
									}
									toSend.push("5.# " + map5.title + " (☆" + map5.difficultyrating.substring(0, map5.difficultyrating.split(".")[0].length + 3) + ")\n\tScore: " + data[4].score.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Rank: " + data[4].rank + " | Max Combo: " + data[4].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " | Misses: " + data[4].countmiss);
									bot.createMessage(msg.channel.id, toSend.join("\n") + "```");
								});
							});
						});
					});
				});
			});
    } else {return 'wrong usage';}
  }
};
