/*******************************************
 * copyright: nodeCache.js @github.com/akashchouhan16
 * author: @akashchouhan16
 * *****************************************
*/

const { log, warn, error } = require("console")
const CONSTANTS = require("./constants")
const { Validator } = require("./validator")
const process = require("node:process")

class Logger {
    #validator
    constructor(options = {}) {
        this.formatOptions = {
            dateStyle: "short",
            timeStyle: "short",
            hour12: true,
        }
        this.#validator = new Validator(options)

        if (this.#validator.validate(options)) {
            this.mode = options.mode // permitted: [node, std, exp]
            this.type = options.type ?? this.#setType(options.type) // permitted: [info, warn, error, fatal]
            this.path = options.path //permitted: [none, console, file]
        } else {
            this.mode = "none"
            this.type = "info"
            this.path = "none"
            const date = new Date().toLocaleString("en-US", this.formatOptions)
            this.log(`${date}: ${CONSTANTS.INVALID_INPUT}`)
        }
    }
    #setType(type) {
        this.type = type
    }
    log(message, options = {}) {
        if (!message || this.mode === "none")
            return
        if (typeof message !== "string") {
            if (typeof message === "object") {
                message = JSON.stringify(message)
            } else {
                message = String(message)
            }
        }
        const Options = {
            mode: this.mode,
            type: this.type,
            path: this.path,
            ...options
        }


        const date = new Date().toLocaleString("en-US", this.formatOptions)

        switch (Options.type) {
            case "default":
            case "info":
                log(`[🍁 Info] ${date}: ${message}`)
                break
            case "warn":
                warn(`[🍁 Warn] ${date}: ${message}`)
                break
            case "error":
                error(`[🍁 Error] ${date}: ${message}`)
                break
            case "fatal":
                error(`[🍁 Fatal] ${date}: ${message}`)
                if (Options.mode === "exp") {
                    error(`[🍁 Fatal] ${date}: ${CONSTANTS.TERMINATE_MODE_EXP}`)
                    process.exit(1)
                }
                break
            default:
                log(`[🍁 ${Options.type}] ${date}: ${message}`)
                break
        }
    }
}

module.exports = Logger