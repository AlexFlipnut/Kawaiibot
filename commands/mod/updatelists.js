const config = require("../../config.json")
const utils = require("../../utils/utils.js")

module.exports = {
	desc: "Updates the bot lists",
	usage: "",
	hidden: true,
	ownerOnly: true,
	task(bot) {
		if (config.carbonKey) { //Send servercount to Carbon bot list
			utils.updateCarbon(config.carbonKey, bot.guilds.size);
		}

		if (config.abalBotsKey) { //Send servercount to Abal's bot list
			utils.updateAbalBots(bot.user.id, config.abalBotsKey, bot.guilds.size);
		}

		if (config.botStatsPath) { //Update JSON for web server info for bot websites
			utils.updateWebsite(bot, config.botStatsPath, bot.guilds.size, bot.users.size);
		}
	}
};