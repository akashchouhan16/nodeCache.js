/*******************************************
 * copyright: nodeCache.js @github.com/akashchouhan16
 * author: @akashchouhan16
 * *****************************************
*/
const Logger = require("./utils/logger")
const { Worker, isMainThread, workerData, parentPort } = require("worker_threads")


class NodeCache {
    constructor(options = {}) {
        this.cache = {};
        this.logger = new Logger({ ...options })
        if (isMainThread) {
            this.worker = new Worker(__filename, { workerData: { interval: 1000 } });
            this.worker.on("message", this._onWorkerMessage.bind(this));
            this.worker.on("error", console.error);
        } else {
            this.interval = workerData.interval;
            this.timer = setInterval(this._expire.bind(this), this.interval);
        }
        this.logger.log(`nodeCache.js initialized`)
    }

    get(key) {
        const cacheItem = this.cache[key];
        if (!cacheItem) {
            this.logger.log("Item not found with key: " + key);
            return undefined;
        }
        if (cacheItem.ttl && cacheItem.ttl < Date.now()) {
            this.delete(key);
            this.logger.log("Item not found with key: " + key);
            return undefined;
        }
        return cacheItem.value;
    }

    put(key, value, ttl) {
        if (!key || !value) {
            this.logger.log(`Invalid key or value`)
            return false;
        }

        if (typeof value !== "string") {
            if (typeof value == "object") {
                value = JSON.stringify(value);
            } else {
                value = String(value);
            }
        }
        this.cache[key] = { value, ttl: ttl ? Date.now() + ttl : 0 };
        return true;
    }

    delete(key) {
        delete this.cache[key];
    }

    _onWorkerMessage({ key }) {
        this.delete(key);
    }

    _expire() {
        const now = Date.now();
        for (const [key, cacheItem] of Object.entries(this.cache)) {
            if (cacheItem.ttl && cacheItem.ttl < now) {
                this.worker.postMessage({ key });
            }
        }
    }

    close() {
        if (isMainThread) {
            this.worker.terminate();
        } else {
            clearInterval(this.timer);
        }
    }
}

if (!isMainThread) {
    setTimeout(() => {
        parentPort.postMessage({ key: workerData.key });
    }, workerData.interval);
}


module.exports = NodeCache