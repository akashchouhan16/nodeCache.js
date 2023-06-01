/**
 * author: @akashchouhan16
 * copyright: 2023 nodeCache @github.com/akashchouhan16
 * */
const Logger = require("./utils/logger")
const { Worker, isMainThread, workerData, parentPort } = require("worker_threads")
const url = require("url")

// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

class NodeCache {
    constructor() {
        this.cache = {};
        this.logger = new Logger({
            mode: "default",
            behaviour: "std"
        })
        if (isMainThread) {
            this.worker = new Worker(__filename, { workerData: { interval: 1000 } });
            this.worker.on('message', this._onWorkerMessage.bind(this));
            this.worker.on('error', console.error);
        } else {
            this.interval = workerData.interval;
            this.timer = setInterval(this._expire.bind(this), this.interval);
        }

        this.logger.log(`NodeCache is initialized`)
    }

    get(key) {
        const cacheItem = this.cache[key];
        if (!cacheItem) {
            this.logger.log('Item not found with key: ' + key);
            return undefined;
        }
        if (cacheItem.ttl && cacheItem.ttl < Date.now()) {
            this.delete(key);
            this.logger.log('Item not found with key: ' + key);
            return undefined;
        }
        return cacheItem.value;
    }

    put(key, value, ttl) {
        if (!key || !value) {
            this.logger.log(`Invalid key or value`, { type: 'error' })
            return false;
        }

        if (typeof value !== 'string') {
            if (typeof value == 'object') {
                value = JSON.stringify(value);
            } else {
                value = toString(value);
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