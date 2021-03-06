if (parseFloat(process.versions.node) < 6) {
    throw new Error("Incompatible node version. Install Node 6 or higher.");
}

global.Promise = require("bluebird"); // Cause we are cool :^)

var reload = require("require-reload")(require),
    fs = require("fs"),
    Eris = require("eris"),
    config = reload("./config.json"),
    validateConfig = reload("./utils/validateConfig.js"),
    CommandManager = reload("./utils/CommandManager.js"),
    utils = reload("./utils/utils.js"),
    remind = require("./utils/remind.js"),
    settingsManager = reload("./utils/settingsManager.js"),
    games = reload("./special/games.json"),
    CommandManagers = [],
    events = {};

global.commandsProcessed = 0;
global.cleverbotTimesUsed = 0;
global.r;

var initDb = async () => {
    if (config.hasOwnProperty("db")) {
        let options = config.db;
        options.db = options.database;

        global.r = require("rethinkdbdash")(options);

        /** Create the main database if not exists */
        r.dbList().contains(config.db.database)
            .do((databaseExists) => r.branch(
                databaseExists, {
                    dbs_created: 0
                },
                r.dbCreate("venus")
            )).run();

        /** Create the tables if not exists */
        await(r.tableList().contains("guild")
            .do((tableExists) => r.branch(
                tableExists, {
                    dbs_created: 0
                },
                r.tableCreate("guild", {
                    primaryKey: "guildId"
                })
            )).run());
        await(r.tableList().contains("fanart")
            .do((tableExists) => r.branch(
                tableExists, {
                    dbs_created: 0
                },
                r.tableCreate("fanart")
            )).run());
        let exists = await(r.tableList().contains("reminders").run());
        if (!exists) {
            await(r.tableCreate("reminders").run());
        }

        /** Create the secondary indexes if not exists */
        let list = await(r.table("reminders").indexList().run());
        if (list.indexOf("timestamp") == -1) {
            r.table("reminders").indexCreate("timestamp").run();
        }
        if (list.indexOf("userId") == -1) {
            r.table("reminders").indexCreate("userId").run();
        }
        if (list.indexOf("userAndTime") == -1) {
            r.table("reminders").indexCreate("userAndTime", [r.row("userId"), r.row("timestamp")]).run();
        }
    } else { console.log("Please add a db section to your config!"); }
};

initDb();

validateConfig(config).catch(() => process.exit(0));
global.logger = new (reload("./utils/Logger.js"))(config.logTimestamp);

process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection:", reason.stack);
});

/* eslint-disable test */
global.bot = new Eris(`Bot ${config.token}`, {
    autoReconnect: true,
    disableEveryone: true,
    getAllUsers: true,
    messageLimit: 10,
    sequencerWait: 100,
    moreMentions: true,
    disableEvents: config.disableEvents,
    firstShardID: 0,
    lastShardID: 0,
    maxShards: 1,
    gatewayVersion: 6,
    cleanContent: true
});
/* eslint-enable test */

function loadCommandSets() {
    return new Promise(resolve => {
        CommandManagers = [];
        for (let prefix in config.commandSets) { // Add command sets
            let color = config.commandSets[prefix].color;
            if (color && !logger.isValidColor(color)) {
                logger.warn(`Log color for ${prefix} invalid`);
                color = undefined;
            }
            CommandManagers.push(new CommandManager(config, prefix, config.commandSets[prefix].dir, color));
        }
        resolve();
    });
}

function initCommandManagers(index = 0) {
    return new Promise((resolve, reject) => {
        CommandManagers[index].initialize(bot, config, settingsManager) // Load CommandManager at {index}
            .then(() => {
                logger.debug(`Loaded CommandManager ${index}`, "INIT");
                index++;
                if (CommandManagers.length > index) { // If there are more to load
                    initCommandManagers(index) // Loop through again
                        .then(resolve)
                        .catch(reject);
                } else // If that was the last one resolve
                {
                    resolve();
                }
            }).catch(reject);
    });
}

function loadEvents() { // Load all events in events/
    return new Promise((resolve, reject) => {
        fs.readdir(`${__dirname}/events/`, (err, files) => {
            if (err) { reject(`Error reading events directory: ${err}`); } else if (!files) { reject("No files in directory events/"); } else {
                for (let name of files) {
                    if (name.endsWith(".js")) {
                        name = name.replace(/\.js$/, "");
                        try {
                            events[name] = reload(`./events/${name}.js`);
                            initEvent(name);
                        } catch (e) {
                            logger.error(`${e}\n${e.stack}`, `Error loading ${name.replace(/\.js$/, "")}`);
                        }
                    }
                }
                resolve();
            }
        });
    });
}

function initEvent(name) { // Setup the event listener for each loaded event.
    if (name === "messageCreate") {
        bot.on("messageCreate", msg => {
            if (msg.content.startsWith(config.reloadCommand) && config.adminIds.includes(msg.author.id)) // check for reload or eval command
            {
                reloadModule(msg);
            } else if (msg.content.startsWith(config.evalCommand) && config.adminIds.includes(msg.author.id)) {
                evaluate(msg);
            } else {
                events.messageCreate.handler(bot, msg, CommandManagers, config, settingsManager);
            }
        });
    } else if (name === "channelDelete") {
        bot.on("channelDelete", channel => {
            settingsManager.handleDeletedChannel(channel);
        });
    } else if (name === "ready") {
        bot.on("ready", () => {
            events.ready(bot, config, games, utils);
        });
    } else {
        bot.on(name, function() { // MUST NOT BE ANNON/ARROW FUNCTION
            events[name](bot, settingsManager, config, ...arguments);
        });
    }
}

function miscEvents() {
    return new Promise(resolve => {
        if (bot.listeners("error").length === 0) {
            bot.on("error", (e, id) => {
                logger.error(`${e}\n${e.stack}`, `SHARD ${id} ERROR`);
            });
        }
        if (bot.listeners("shardReady").length === 0) {
            bot.on("shardReady", id => {
                logger.logBold(` SHARD ${id} CONNECTED`, "green");
            });
        }
        if (bot.listeners("disconnected").length === 0) {
            bot.on("disconnected", () => {
                logger.logBold(" DISCONNECTED FROM DISCORD", "red");
            });
        }
        if (bot.listeners("shardDisconnect").length === 0) {
            bot.on("shardDisconnect", (e, id) => {
                logger.error(e, `SHARD ${id} DISCONNECT`);
            });
        }
        if (bot.listeners("shardResume").length === 0) {
            bot.on("shardResume", id => {
                logger.logBold(` SHARD ${id} RESUMED`, "green");
            });
        }
        if (bot.listeners("guildCreate").length === 0) {
            bot.on("guildCreate", guild => {
                logger.debug(guild.name, "GUILD CREATE");
            });
        }
        if (bot.listeners("guildDelete").length === 0) {
            bot.on("guildDelete", (guild, unavailable) => {
                if (unavailable === false) {
                    logger.debug(guild.name, "GUILD REMOVE");
                }
            });
        }
        return resolve();
    });
}

function login() {
    logger.logBold(`Logging in...`, "green");
    bot.connect().catch(error => {
        logger.error(error, "LOGIN ERROR");
    });
}

// Load commands and log in
loadCommandSets()
    .then(initCommandManagers)
    .then(loadEvents)
    .then(miscEvents)
    .then(login)
    .catch(error => {
        logger.error(error, "ERROR IN INIT");
    });

function reloadModule(msg) {
    logger.debug(`${msg.author.username}: ${msg.content}`, "RELOAD MODULE");
    let arg = msg.content.substr(config.reloadCommand.length).trim();

    for (let i = 0; i < CommandManagers.length; i++) { // If arg starts with a prefix for a CommandManager reload/load the file.
        if (arg.startsWith(CommandManagers[i].prefix)) {
            return CommandManagers[i].reload(bot, msg.channel.id, arg.substr(CommandManagers[i].prefix.length), config, settingsManager);
        }
    }

    if (arg === "CommandManagers") {
        loadCommandSets()
            .then(initCommandManagers)
            .then(() => {
                bot.createMessage(msg.channel.id, "Reloaded CommandManagers");
            }).catch(error => {
                logger.error(error, "ERROR IN INIT");
            });
    } else if (arg.startsWith("utils/")) {
        fs.access(`${__dirname}/${arg}.js`, fs.R_OK | fs.F_OK, err => {
            if (err) {
                bot.createMessage(msg.channel.id, "That file does not exist!");
            } else {
                switch (arg.replace(/(utils\/|\.js)/g, "")) {
                    case "CommandManager":
                        CommandManager = reload("./utils/CommandManager.js");
                        bot.createMessage(msg.channel.id, "Reloaded utils/CommandManager.js");
                        break;
                    case "settingsManager":
                        {
                            let tempCommandList = settingsManager.commandList;
                            settingsManager.destroy();
                            settingsManager = reload("./utils/settingsManager.js");
                            settingsManager.commandList = tempCommandList;
                            bot.createMessage(msg.channel.id, "Reloaded utils/settingsManager.js");
                            break;
                        }
                    case "utils":
                        utils = reload("./utils/utils.js");
                        bot.createMessage(msg.channel.id, "Reloaded utils/utils.js");
                        break;
                    case "validateConfig":
                        validateConfig = reload("./utils/validateConfig.js");
                        bot.createMessage(msg.channel.id, "Reloaded utils/validateConfig.js");
                        break;
                    case "Logger":
                        logger = new (reload("./utils/Logger.js"))(config.logTimestamp);
                        bot.createMessage(msg.channel.id, "Reloaded utils/Logger.js");
                        break;
                    default:
                        bot.createMessage(msg.channel.id, "Can't reload that because it isn't already loaded");
                        break;
                }
            }
        });
    } else if (arg.startsWith("events/")) {
        arg = arg.substr(7);
        if (events.hasOwnProperty(arg)) {
            events[arg] = reload(`./events/${arg}.js`);
            bot.createMessage(msg.channel.id, `Reloaded events/${arg}.js`);
        } else {
            bot.createMessage(msg.channel.id, "That event isn't loaded");
        }
    } else if (arg.startsWith("special/")) {
        switch (arg.substr(8)) {
            case "cleverbot":
                events.messageCreate.reloadCleverbot(bot, msg.channel.id);
                break;
            case "games":
                games = reload("./special/games.json");
                bot.createMessage(msg.channel.id, `Reloaded special/games.json`);
                break;
            default:
                bot.createMessage(msg.channel.id, "Not found");
                break;
        }
    } else if (arg === "config") {
        validateConfig = reload("./utils/validateConfig.js");
        config = reload("./config.json");
        validateConfig(config).catch(() => process.exit(0));
        bot.createMessage(msg.channel.id, "Reloaded config");
    }
}

function evaluate(msg) {
    logger.debug(`${msg.author.username}: ${msg.content}`, "EVAL");
    let toEval = msg.content.substr(config.evalCommand.length).trim();
    let result = "~eval failed~";

    try {
        result = eval(toEval);
    } catch (error) {
        logger.debug(error.message, "EVAL FAILED");
        bot.createMessage(msg.channel.id, `\`\`\`diff\n- ${error}\`\`\``); // Send error to chat also.
    }

    if (result !== "~eval failed~") {
        logger.debug(result, "EVAL RESULT");
        bot.createMessage(msg.channel.id, `${result}`);
    }
}


if (config.carbonKey) { // Send servercount to Carbon bot list
    setInterval(() => {
        if (bot.uptime !== 0) {
            utils.updateCarbon(config.carbonKey, {
                servercount: bot.guilds.size,
                shard_id: Number(process.env.SHARD_ID),
                shard_count: Number(process.env.MAX_SHARDS)
            });
        }
    }, 1800000);
}

if (config.abalBotsKey) { // Send servercount to Abal's bot list
    setInterval(() => {
        if (bot.uptime !== 0) {
            utils.updateAbalBots(bot.user.id, config.abalBotsKey, {
                server_count: bot.guilds.size,
                shard_id: Number(process.env.SHARD_ID),
                shard_count: Number(process.env.MAX_SHARDS)
            });
        }
    }, 1800000);
}
if (config.dbotsorg) {
    setInterval(() => {
        if (bot.uptime !== 0) {
            utils.updateDBotsOrg(bot.user.id, config.dbotsorg, {
                server_count: bot.guilds.size,
                shard_id: Number(process.env.SHARD_ID),
                shard_count: Number(process.env.MAX_SHARDS)
            });
        }
    }, 1800000);
}
if (config.botStatsPath) { // Update JSON for web server info for bot websites
    setInterval(() => {
        if (bot.uptime !== 0) {
            utils.updateWebsite(bot, config.botStatsPath, bot.guilds.size, bot.users.size);
        }
    }, 1800000);
}

setInterval(() => { // Update the bot's status for each shard every 10 minutes
    if (games.length !== 0 && bot.uptime !== 0 && config.cycleGames === true) {
        bot.shards.forEach(shard => {
            let name = games[~~(Math.random() * games.length)];
            shard.editStatus("online", {
                name: name
            });
        });
    }
}, 600000);

setInterval(() => {
    remind.checkReminders(bot);
}, 30000);

function handleShutdown(e) {
    console.error(e);
    bot.disconnect({
        reconnect: false
    });
    // r.close();
    process.exit();
}
process.on("SIGINT", e => handleShutdown(e));
process.on("SIGTERM", e => handleShutdown(e));
process.on("SIGQUIT", e => handleShutdown(e));
process.on("uncaughtException", e => handleShutdown(e));

process.retrieve = (type, message) => new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
        process.removeListener("message", handleFetching);
        reject(new Error("TIMEDOUT"));
    }, 5000);
    const timestamp = Date.now();
    const handleFetching = (m) => { // eslint-disable-line func-style
        /* Prevent multiple evals going mad */
        if (typeof m === "object" && m.type === type && m.timestamp === timestamp) {
            clearTimeout(timeout);
            process.removeListener("message", handleFetching);
            resolve(m.contents);
        }
    };
    process.on("message", handleFetching);
    console.log(process);
    process.send({
        type: type,
        contents: message,
        timestamp
    });
});

process.on("message", (m) => {
    switch (m.type) {
        case "_ping": {
            process.send({
                type: "_ping",
                timestamp: m.timestamp
            });
            break;
        }
        case "_stats": {
            sendStats();
            break;
        }
        case "_evaluate": {
            let results;
            try {
                results = eval(m.contents); // eslint-disable-line no-eval
            } catch (err) {
                results = `\`\`\`diff\n- ${err.message}\n\`\`\``;
            }
            process.send({
                type: "_evaluate",
                contents: results,
                timestamp: m.timestamp
            });
            break;
        }
        case "_fetchClientValue": {
            const props = m.contents.split(".");
            let that = bot;
            for (const prop of props) {
                if (that.hasOwnProperty(prop)) { that = that[prop]; } // eslint-disable-line no-prototype-builtins, consistent-this
                else { that = null; break; } // eslint-disable-line consistent-this
            }
            process.send({
                type: "_fetchClientValue",
                contents: that,
                timestamp: m.timestamp
            });
            break;
        }
    }
});

/*
bot.on("ws::statsUpdate", () => {
	process.send({type: "statsUpdate", contents: {commandsProcessed, cleverbotTimesUsed}});
});
*/

setInterval(sendStats, 5000);

function sendStats(m) {
    // process.send({
    //     type: "stats",
    //     timestamp: m ? m.timestamp : undefined,
    //     contents: {
    //         memory: process.memoryUsage(),
    //         shards: bot.shards.map(s => ({
    //             id: s.id,
    //             status: s.status,
    //             size: bot.guilds.filter(g => g.shard.id === s.id).length
    //         })),
    //         id: process.env.SHARD_ID
    //     }
    // });
}
