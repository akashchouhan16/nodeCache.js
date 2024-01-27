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
    #logger
    #cache
    #config
    constructor(options = {}) {
        this.#cache = {}
        this.#config = Object.assign({}, cacheConfig)
        this.#logger = new Logger({ ...options })
        this.#setConfigurations(options)

        if (isMainThread) {
            this.worker = new Worker(path.join(__dirname, "/worker/worker.js"))
            this.worker.on("message", this._onWorkerMessage.bind(this))
            this.worker.on("error", (err) => {
                this.#logger.log(`${err.message}`, { type: "Worker Error" })
            })

            this.worker.postMessage({ cache: this.#cache })
        }

        this.#logger.log(`nodeCache.js initialized`)
    }

    #setConfigurations(options) {
        if (options) {
            let { forceString, maxKeys, stdTTL, valueOnly } = options

            if (valueOnly !== undefined && typeof valueOnly === "boolean")
                this.#config.valueOnly = valueOnly
            if (forceString !== undefined && typeof forceString === "boolean")
                this.#config.forceString = forceString
            if (maxKeys && typeof maxKeys === "number" && maxKeys > 0)
                this.#config.maxKeys = maxKeys
            if (stdTTL && typeof stdTTL === "number" && stdTTL >= 0)
                this.#config.stdTTL = stdTTL
        }
    }

    getLogConfig() {
        return this.#logger
    }

    getCacheConfig() {
        return this.#config
    }

    get(key) {
        const cacheItem = this.#cache[key]

        if (!cacheItem) {
            this.#config.cacheMiss += 1
            this.#logger.log(`${CONSTANTS.ITEM_NOTFOUND} : ${key}`)
            return undefined
        }
        if (this.#config.stdTTL != 0 && cacheItem.ttl && cacheItem.ttl < Date.now()) {
            this.#config.cacheMiss += 1
            // update the context of cache in the worker thread.
            this.worker.postMessage({ cache: this.#cache })
            //passive ttl expire - fallback for env not supporting worker threads
            this.delete(key)
            this.#logger.log(`${CONSTANTS.ITEM_NOTFOUND} : ${key}`)
            return undefined
        }

        this.#config.cacheHit += 1
        if (this.#config.valueOnly) {
            return cacheItem.value
        }
        return cacheItem
    }

    set(key, value, ttl) {
        if (!key && !value) {
            this.#logger.log(CONSTANTS.INVALID_KEY_VALUE)
            return false
        } else if (!key || !["string", "number"].includes(typeof key)) {
            this.#logger.log(CONSTANTS.INVALID_KEY_TYPE)
            return false
        }
        else if (!value || !["string", "number", "object"].includes(typeof value)) {
            this.#logger.log(CONSTANTS.INVALID_VALUE_TYPE)
            return false
        }

        if (this.#config.maxKeys > 0 && this.#config.maxKeys <= Object.keys(this.#cache).length) {
            throw new Error(CONSTANTS.MAX_CACHE_LIMIT)
        }

        if (this.#config.forceString && typeof value !== "string") {
            value = JSON.stringify(value)
        }

        if (ttl && (typeof ttl !== "number")) {
            throw new Error(CONSTANTS.INVALID_TTL_TYPE)
        }

        this.#cache[key] = { value, ttl: ttl ? Date.now() + Math.abs(ttl) : Date.now() + this.#config.stdTTL }
        this.#config.keyCount += 1
        // update the context of cache in the worker thread.
        // this.worker.postMessage({ cache: this.#cache, logger: this.#logger, action: "set" })
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
            return [false]
        }

        if (this.#config.maxKeys > 0 && this.#config.maxKeys <= values.length) {
            throw new Error(CONSTANTS.MAX_CACHE_LIMIT)
        }

        let responseObject = []
        for (let data of values) {
            let { key, value, ttl } = data
            responseObject.push(this.set(key, value, ttl))
        }

        return responseObject
    }

    getTTL(key) {
        if (!key || (!["string", "number"].includes(typeof key))) {
            throw new Error(CONSTANTS.INVALID_KEY_TYPE)
        }
        let item = this.#cache[key]
        return item ? item.ttl : undefined
    }

    setTTL(key, ttl) {
        if (!key || (typeof key !== "string" && typeof key !== "number")) {
            throw new Error(CONSTANTS.INVALID_KEY_TYPE)
        }

        if (ttl === undefined || (typeof ttl !== "number")) {
            throw new Error(CONSTANTS.INVALID_TTL_TYPE)
        }

        if (!this.#cache[key])
            return false

        const newTTL = Date.now() + Math.abs(ttl)
        this.#cache[key].ttl = newTTL
        return true
    }

    async refresh() {
        return new Promise((resolve, reject) => {
            try {
                const now = Date.now()
                for (const [key, cacheItem] of Object.entries(this.#cache)) {
                    if (cacheItem.ttl && Number(cacheItem.ttl) < Number(now)) {
                        this.delete(key)
                    }
                }
                resolve(this.#cache)
            } catch (error) {
                reject(new Error(`Refresh failed to update cache: ${error.message}`))
            }
        })

    }

    global() {
        const { cacheHit, cacheMiss, keyCount } = this.#config
        return {
            cacheHit,
            cacheMiss,
            keyCount
        }
    }

    flush() {
        this.#config = cacheConfig
        this.#cache = {}
    }

    delete(key) {
        delete this.#cache[key]
        this.#config.keyCount -= 1
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