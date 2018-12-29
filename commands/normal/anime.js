const yargs = require("yargs");
const superagent = require("superagent");

module.exports = {
  desc: "Gets details on an anime from Kitsu. Do ``+anime --help`` for more info",
  usage: "<anime name> [--help] [--popular | --airing | --unreleased]",
  cooldown: 6,
  task(bot, msg, suffix) {
    const args = yargs.parse(suffix);
    if (args.help) {
      let helpMsg = [];
      helpMsg.push(":information_source: **Anime Search Help**");
      helpMsg.push("**Usage**: ``+anime <search_term> [--popular | --airing | --unreleased]``");
      helpMsg.push("\n**Optional Flags:**\n Tags to include to search/filter.");
      helpMsg.push("â–ª``--help / -h`` | Display this help");
      helpMsg.push("â–ª``--popular / -p`` | Sort by score and return first entry");
      helpMsg.push("â–ª``--airing / --aired / -a`` | Displays only animes currently airing/already aired");
      helpMsg.push("â–ª``--unreleased / -u`` | Displays only animes that aren't aired yet");
      helpMsg.push("NOTE: Using both ``--unreleased`` and ``--airing`` will pull the first result returned by the API unfiltered. Results may be inaccurate in this case.");
      return msg.channel.createMessage(helpMsg.join("\n"));
    }
    const query = args._.join(" ");
    const sorter = (a, b) => {
      if (args.popular || args.p) {
        if (a.attributes.averageRating > b.attributes.averageRating) return 1;
        return -1;
      }
      return 0;
    };
    const filter = o => {
      if (o.attributes.endDate && (args.airing || args.a)) return false;
      if (o.attributes.startDate && (args.unreleased || args.u)) return false;
      return true;
    };
    let message = "```diff\n";
    superagent.get(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=3`)
      .end((err, response) => {
        if (err) {
          console.error(err.stack);
          return msg.channel.createMessage(`There was an error in the API query...`);
        }
        if (response.statusCode !== 200) {
          // console.log(response.statusCode);
          return msg.channel.createMessage(`API returned ${response.statusCode}`);
        }
        let animes = response.body.data.sort(sorter).filter(filter);
        if (!animes.length) return msg.channel.createMessage(`Your anime/manga was not found!\n*I blame the Kitsu database for not having the anime you're looking for! I-Its not my fault okay?!*`);
        animes.slice(0, 3).forEach(anime => {
          message += `- ${anime.title}\n`;
          message += `  + Kitsu URL: ${anime.links.self}\n`;
          message += `  + Age Rating: ${anime.attributes.ageRating}\n`;
          // message += `  + Genres: ${anime.genres.map(o => o.name).join(", ")}\n`;
          message += `  + Started Airing: ${anime.attributes.startDate ? anime.attributes.startDate : "N/A"}\n`;
          message += `  + Finished Airing: ${anime.attributes.endDate ? anime.attributes.endDate : "N/A"}\n`;
          message += `  + Show Type: ${anime.attributes.showType}\n`;
          message += `  + Ep. Count: ${anime.attributes.episodeCount}\n`;
          message += `  + Ep. Length: ${anime.attributes.episodeLength} min.\n`;
        });
        return msg.channel.createMessage(`${message}\`\`\``);
      });
    return null;
  }
};
