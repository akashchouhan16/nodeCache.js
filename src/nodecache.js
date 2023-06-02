/*******************************************
 * copyright: nodeCache.js @github.com/akashchouhan16
 * author: @akashchouhan16
 * *****************************************
*/
const { Worker, isMainThread, workerData, parentPort } = require("worker_threads")
const CONSTANTS = require("./utils/constants");
const Logger = require("./utils/logger")
let cacheConfig = require("./config/cacheConfig")


class NodeCache {
    constructor(options = {}) {
        this.cache = {};
        this.logger = new Logger({ ...options })

        let { forceString, maxKeys } = options
        cacheConfig.forceString = forceString !== undefined && typeof forceString === "boolean" ? forceString : cacheConfig.forceString
        cacheConfig.maxKeys = maxKeys !== undefined && typeof maxKeys === "number" && maxKeys > 0 ? maxKeys : cacheConfig.maxKeys


        if (isMainThread) {
            this.worker = new Worker(__dirname + "/worker/worker.js", { workerData: { interval: 500, cache: this.cache } })
            this.worker.on("message", this._onWorkerMessage.bind(this))
            this.worker.on("error", this.close.bind(this))

            this.worker.postMessage({ cache: this.cache, logger: this.logger, action: "init" })
        }

        this.logger.log(`nodeCache.js initialized`)
    }

    get(key) {
        const cacheItem = this.cache[key];

        // update the context of cache in the worker thread.
        this.worker.postMessage({ cache: this.cache, logger: this.logger, action: "get" });

        if (!cacheItem) {
            this.logger.log(`${CONSTANTS.ITEM_NOTFOUND} : ${key}`)
            return undefined;
        }
        if (cacheItem.ttl && cacheItem.ttl < Date.now()) {
            this.delete(key);
            this.logger.log(`${CONSTANTS.ITEM_NOTFOUND} : ${key}`)
            return undefined;
        }

        return cacheItem.value;
    }

    set(key, value, ttl) {
        if (!key && !value) {
            this.logger.log(CONSTANTS.INVALID_KEY_VALUE)
            return false
        } else if (!key || !value) {
            this.logger.log(!key ? CONSTANTS.INVALID_KEY_TYPE : CONSTANTS.INVALID_VALUE_TYPE)
            return false
        }

        if (cacheConfig.maxKeys > 0 && cacheConfig.maxKeys <= Object.keys(this.cache).length) {
            throw new Error(CONSTANTS.MAX_CACHE_LIMIT)
        }

        if (cacheConfig.forceString && typeof value !== "string") {
            value = JSON.stringify(value)
        }

        this.cache[key] = { value, ttl: ttl ? Date.now() + ttl : 0 };

        // update the context of cache in the worker thread.
        this.worker.postMessage({ cache: this.cache, logger: this.logger, action: "set" });
        return true;
    }

    getM(keys) {
        if (!Array.isArray(keys)) {
            throw new Error(CONSTANTS.INVALID_GETM_INPUT)
        } else if (keys.length === 0) {
            return [];
        }
        let responseObject = [];
        for (const key of keys) {
            responseObject.push(this.get(key))
        }
        return responseObject;
    }

    setM(values) {
        if (!Array.isArray(values)) {
            throw new Error(CONSTANTS.INVALID_SETM_INPUT)
        } else if (values.length === 0) {
            return false
        }

        if (cacheConfig.maxKeys > 0 && cacheConfig.maxKeys <= values.length) {
            throw new Error(CONSTANTS.MAX_CACHE_LIMIT)
        }

        let responseObject = []
        for (let data of values) {
            let { key, value, ttl } = data;
            responseObject.push(this.set(key, value, ttl ? ttl : 0));
        }

        return responseObject;
    }
    delete(key) {
        delete this.cache[key];
    }

    _onWorkerMessage({ key }) {
        this.delete(key);
    }

    close() {
        if (isMainThread) {
            this.worker.terminate();
        } else {
            clearInterval(this.timer);
        }
    }
}


module.exports = NodeCache