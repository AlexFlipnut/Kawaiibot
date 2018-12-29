const config = require("./config.json");
const Chalk = require("chalk");
const manager = new (require("./manager.js"))("./index.js", {
	debug: config.sharder.debugMode,
	reconnect: true,
	token: config.token,
	autoSpawn: false,
	maxShards: config.shardCount
});


const webserver = require("./utils/webserver_.js")(manager);

manager.on("manager:newShard", (shard) => {
	console.log(Chalk.green(`[SHARD ${shard.id}] UP!`));
});
manager.on("manager:shardReady", (shard) => {
	console.log(Chalk.green(`[SHARD ${shard.id}] READY!`));
});
manager.on("manager:deadShard", (shard) => {
	console.log(Chalk.red(`[SHARD ${shard.id}] DEAD!`));
});
manager.on("manager:shardDisconnect", (shard) => {
	console.log(Chalk.red(`[SHARD ${shard.id}] DISCONNECT!`));
});
manager.on("manager:stderr", (shard, err) => {
	console.log(Chalk.red(`[SHARD ${shard.id} | STDERR] ${err}`));
});
manager.on("manager:stdout", (shard, message) => {
	console.log(Chalk.green(`[SHARD ${shard.id} | STDOUT]`), message);
});

// TODO: Add webserver with guild/stat fetching
manager.spawnAll();
