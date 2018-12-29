const childProcess = require("child_process");
const Promise = require("bluebird");
const path = require("path");
const Eris = require("eris"), moment = require("moment");
const client = new Eris.Client("super legit token");
const messages = ["aw hell naw!", "whoops something broke...", "you done hecked up.", "this isn't cute whatsoever!",
	"thanks blizzard!", "its not a bug, its a feature!", "blame the cat!", "blame the luna!", "blame the aurieh!",
	"blame the splixl!", "this was most definitely caused by rei."];

class Shard {
	constructor(manager, id) {
		this.sharder = manager;
		this.id = id;
		this.missedPings = 0;
		this.process = childProcess.fork(path.resolve(this.sharder.file),
			this.sharder.options.debug ? ["--expose-gc", "--harmony"] : [], {
				env: {
					SHARD_ID: this.id,
					MAX_SHARDS: this.sharder.options.maxShards
				},
				silent: true
			});
		this.process.on("message", (m) => {
			this.sharder.emit("manager:message", this, m);
		});
		// this.process.on("exit", this.handleShutdown);
		this.process.on("SIGINT", this.handleShutdown.bind(this));
		this.process.on("SIGTERM", this.handleShutdown.bind(this));
		this.process.on("SIGQUIT", this.handleShutdown.bind(this));
		this.process.on("SIGKILL", this.handleShutdown.bind(this));
		this.process.on("uncaughtException", this.handleShutdown.bind(this));

		this.process.stdout.on("data", (chunk) => {
			this.sharder.emit("manager:stdout", this, chunk.toString());
		});
		this.process.stderr.on("data", (chunk) => {
			this.sharder.emit("manager:stderr", this, chunk.toString());
		});

		this.pingInterval = setInterval(() => {
			this.retrieve("_ping").then(() => {
				this.pinging = false;
				this.missedPings = 0;
			}).catch(() => {
				if (++this.missedPings >= 1) {
					console.error(`Restarting shard ${this.id} after 5 missed pings.`);
					this.kill(true);
					client.executeWebhook("326227014988201994",
						"tp2YmB5m-dAxzUE2sBax2-mz1JVYMDmGWwii1kbVqQKuXFmChMUCoaxSXXSrnqFrIVJU",
						{
							embeds: [
								{
									description: ` shard #${this.id} just died. check for ghost processes and shit thx. ${messages[Math.floor(Math.random() * messages.length)]}`,
									timestamp: moment()
								}
							]
						});
				}
			});
		}, 10000);
	}

	handleShutdown(code) {
		this.process.removeAllListeners();
		this.process = null;
		this.sharder.emit("manager:deadShard", this, code);
		if (this.sharder.options.respawn) this.sharder.spawnShard(this.id);
	}

	kill(handle = false) {
		childProcess.spawn("kill", ["-9", this.process.pid]);
		clearInterval(this.pingInterval);
		if (handle) this.handleShutdown();
	}

	send(message) {
		return new Promise((resolve, reject) => {
			const sent = this.process.send(message, err => {
				if (err) reject(err); else resolve(this);
			});
			if (!sent) reject("Failed to send message to shard's process.");
		});
	}
	retrieve(type, message) {
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				try {
					this.process.removeListener("message", handleFetching);
				} catch (err) { reject(err); }
				reject(new Error("TIMEDOUT"));
			}, 5000);
			const timestamp = Date.now();
			const handleFetching = (m) => { // eslint-disable-line func-style
				/* Prevent multiple evals going mad */
				if (typeof m === "object" && m.type === type && m.timestamp === timestamp) {
					clearTimeout(timeout);
					this.process.removeListener("message", handleFetching);
					resolve(m.contents);
				}
			};
			this.process.on("message", handleFetching);
			this.process.send({
				type: type,
				contents: message,
				timestamp
			});
		});
	}
	eval(code) {
		return this.retrieve("_evaluate", code);
	}
	fetchClientValue(prop) {
		return this.retrieve("_fetchClientValue", prop);
	}
}
module.exports = Shard;
