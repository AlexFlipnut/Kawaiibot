var reload = require("require-reload")(require);
module.exports = {
  handler(bot, msg, CommandManagers, config, settingsManager) {
    if (msg.author.bot === true) { return; }

    for (let i = 0; i < CommandManagers.length; i++) {
      if (msg.content.startsWith(CommandManagers[i].prefix)) {
        return CommandManagers[i].processCommand(bot, msg, config, settingsManager);
      }
    }
  }
};

