/*******************************************
 * copyright: nodeCache.js @github.com/akashchouhan16
 * author: @akashchouhan16
 * *****************************************
*/
const { Worker, isMainThread } = require("worker_threads")
const CONSTANTS = require("./utils/constants")
const Logger = require("./utils/logger")
const path = require("path")
let cacheConfig = require("./config/cacheConfig")


class NodeCache {
    constructor(options = {}) {
        this.cache = {}
        this.logger = new Logger({ ...options })

        let { forceString, maxKeys, stdTTL } = options
        cacheConfig.forceString = forceString !== undefined && typeof forceString === "boolean" ? forceString : cacheConfig.forceString
        cacheConfig.maxKeys = maxKeys !== undefined && typeof maxKeys === "number" && maxKeys > 0 ? maxKeys : cacheConfig.maxKeys
        cacheConfig.stdTTL = (stdTTL && typeof stdTTL === "number" && stdTTL >= 0) ? stdTTL : cacheConfig.stdTTL


        if (isMainThread) {
            this.worker = new Worker(path.join(__dirname, "/worker/worker.js"))
            this.worker.on("message", this._onWorkerMessage.bind(this))
            this.worker.on("error", (err) => {
                this.logger.log(`${err.message}`, { type: "Worker Error" })
            })

            this.worker.postMessage({ cache: this.cache })
        }

        this.logger.log(`nodeCache.js initialized`)
    }

    get(key) {
        const cacheItem = this.cache[key]

        if (!cacheItem) {
            cacheConfig.cacheMiss += 1
            this.logger.log(`${CONSTANTS.ITEM_NOTFOUND} : ${key}`)
            return undefined
        }
        if (cacheItem.ttl && cacheItem.ttl < Date.now()) {
            cacheConfig.cacheMiss += 1
            // update the context of cache in the worker thread.
            this.worker.postMessage({ cache: this.cache })
            //passive ttl expire - fallback for env not supporting worker threads
            this.delete(key)
            this.logger.log(`${CONSTANTS.ITEM_NOTFOUND} : ${key}`)
            return undefined
        }

        cacheConfig.cacheHit += 1
        return cacheItem.value
    }

    set(key, value, ttl) {
        if (!key && !value) {
            this.logger.log(CONSTANTS.INVALID_KEY_VALUE)
            return false
        } else if (!key || !["string", "number"].includes(typeof key)) {
            this.logger.log(CONSTANTS.INVALID_KEY_TYPE)
            return false
        }
        else if (!value || !["string", "number", "object"].includes(typeof value)) {
            this.logger.log(CONSTANTS.INVALID_VALUE_TYPE)
            return false
        }

        if (cacheConfig.maxKeys > 0 && cacheConfig.maxKeys <= Object.keys(this.cache).length) {
            throw new Error(CONSTANTS.MAX_CACHE_LIMIT)
        }

        if (cacheConfig.forceString && typeof value !== "string") {
            value = JSON.stringify(value)
        }

        if (ttl && (typeof ttl !== "number")) {
            throw new Error(CONSTANTS.INVALID_TTL_TYPE)
        }

        this.cache[key] = { value, ttl: ttl ? Date.now() + Math.abs(ttl) : Date.now() + cacheConfig.stdTTL }
        cacheConfig.keyCount += 1
        // update the context of cache in the worker thread.
        // this.worker.postMessage({ cache: this.cache, logger: this.logger, action: "set" })
        return true
    }

    getM(keys) {
        if (!Array.isArray(keys)) {
            throw new Error(CONSTANTS.INVALID_GETM_INPUT)
        } else if (keys.length === 0) {
            return []
        }
        let responseObject = []
        for (const key of keys) {
            responseObject.push(this.get(key))
        }
        return responseObject
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
            let { key, value, ttl } = data
            responseObject.push(this.set(key, value, ttl ? ttl : 0))
        }

        return responseObject
    }

    getTTL(key) {
        if (!key || (!["string", "number"].includes(typeof key))) {
            throw new Error(CONSTANTS.INVALID_KEY_TYPE)
        }
        let item = this.cache[key]
        return item ? item.ttl : undefined
    }

    setTTL(key, ttl) {
        if (!key || (typeof key !== "string" && typeof key !== "number")) {
            throw new Error(CONSTANTS.INVALID_KEY_TYPE)
        }

        if (ttl === undefined || (typeof ttl !== "number")) {
            throw new Error(CONSTANTS.INVALID_TTL_TYPE)
        }

        if (!this.cache[key])
            return false;

        const newTTL = Date.now() + Math.abs(ttl)
        this.cache[key].ttl = newTTL
        return true;
    }

    async refresh() {
        return new Promise((resolve, reject) => {
            try {
                const now = Date.now()
                for (const [key, cacheItem] of Object.entries(this.cache)) {
                    if (cacheItem.ttl && Number(cacheItem.ttl) < Number(now)) {
                        this.delete(key)
                    }
                }
                resolve(this.cache)
            } catch (error) {
                reject(`Refresh failed to update cache: ${error.message}`)
            }
        })

    }

    global() {
        const { cacheHit, cacheMiss, keyCount } = cacheConfig
        return {
            cacheHit,
            cacheMiss,
            keyCount
        }
    }

    flush() {
        cacheConfig.cacheHit = 0;
        cacheConfig.cacheMiss = 0;
        cacheConfig.keyCount = 0;
        this.cache = {}
    }

    delete(key) {
        delete this.cache[key]
        cacheConfig.keyCount -= 1
    }

    _onWorkerMessage({ key }) {
        this.delete(key)
    }

    close() {
        if (isMainThread) {
            this.worker.terminate()
        } else {
            clearInterval(this.timer)
        }
    }
}


module.exports = NodeCache