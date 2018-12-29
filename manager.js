const events = require("eventemitter3");
const Shard = require("./utils/Shard");
const Promise = require("bluebird");

class Sharder extends events {
	constructor(base, options = {}) {
		super();

		this.file = base;
		this.startDate = Date.now();
		this.options = {
			respawn: true,
			autoSpawn: true,
			maxShards: 2,
			debug: false
		};
		this.shards = new Map();
		for (let option in options) {
			this.options[option] = options[option];
		}
		if (this.options.autoSpawn) {
			this.spawnAll();
		}
		/* eslint-disable indent */
		this.emit("manager:ready");
		this.on("manager:message", (shard, m) => {
			switch (m.type) {
				case "disconnect": {
					this.emit("manager:shardDisconnect", shard);
					break;
				}
				case "ready": {
					this.emit("manager:shardReady", shard);
					break;
				}
				case "_evaluateAll": {
					this.broadcastEval(m.contents).then(res => {
						shard.send({
							type: "_evaluateAll",
							contents: res,
							timestamp: m.timestamp
						});
					});
					break;
				}
				case "stats": {
					this.emit("manager:stats", shard, m.contents);
					break;
				}
				case "killShard": {
					if (this.shards.get(m.contents)) {
						this.shards.get(m.contents).kill(true);
					}
					break;
				}
			}
		});

		process.on("SIGINT", this.handleShutdown.bind(this));
		process.on("SIGTERM", this.handleShutdown.bind(this));
		process.on("SIGQUIT", this.handleShutdown.bind(this));
		process.on("uncaughtException", this.handleShutdown.bind(this));
		/* eslint-enable indent */

		this.panel = new MonitorPanel(this);
	}
	handleShutdown() {
		console.log("We're going down.");
		this.shards.forEach(s => s.kill());
		process.exit();
	}

	spawnShard(id) {
		const shard = new Shard(this, id);
		if (this.shards.has(id)) this.shards.delete(id);
		this.shards.set(id, shard);
		this.emit("manager:newShard", shard);
	}
	spawnAll() {
		for (let i = 0; i < this.options.maxShards; i++) {
			this.spawnShard(i);
		}
	}
	retrieveAll(type, message) {
		let promises = [];
		this.shards.forEach(shard => {
			promises.push(shard.retrieve(type, message));
		});
		return Promise.all(promises);
	}
	broadcastEval(code) {
		return this.retrieveAll("_evaluate", code);
	}
	broadcastFetch(prop) {
		return this.retrieveAll("_fetchClientValue", prop);
	}
	broadcastStats() {
		return this.retrieveAll("_stats");
	}
	get uptime() {
		return Date.now() - this.startDate;
	}
}
module.exports = Sharder;

const express = require("express"), http = require("http");
const SSE = require("sse"), path = require("path");

class MonitorPanel {
	constructor(manager) {
		this.manager = manager;

		this.app = express();
		this.server = http.createServer(this.app);

		this.sse = new SSE(this.server, {
			path: "/stats",
			headers: {
				"X-Powered-By": "shitcode"
			}
		});

		this.sse.on("connection", this.handleConnection.bind(this));

		this.app.use(express.static(path.join(__dirname, "special", "panel")));
		this.app.set("view engine", "html");

		this.server.listen(8092);

		this.manager.on("manager:stats", (shard, stats) => {
			this.shards[shard.id] = stats;
			this.broadcast("stats", JSON.stringify(stats));
		});

		// this.interval = setInterval(this.broadcastStats.bind(this), 10000);

		this.clients = [];

		this.shards = {};
	}

	broadcast(...args) {
		for (const client of this.clients) client.send(...args);
	}

	broadcastStats() {
		this.manager.broadcastStats().then(stats => {
			const shards = {};
			for (const shard of stats) shards[shard.id] = shard;
			this.broadcast("allStats", JSON.stringify({
				shards
			}));
			this.shards = shards;
		}).catch(err => {
			console.error(err);
		});
	}

	receiveStats(shard, message) {
		this.shards[shard.id] = message.contents;
	}

	handleConnection(client) {
		this.clients.push(client);
		client.send("You shouldn't be here...");
		client.send("allStats", JSON.stringify({ shards: this.shards }));
		client.on("close", () => {
			this.clients.splice(this.clients.indexOf(client), 1);
		});
	}
}
