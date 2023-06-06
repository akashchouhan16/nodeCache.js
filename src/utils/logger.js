/*******************************************
 * copyright: nodeCache.js @github.com/akashchouhan16
 * author: @akashchouhan16
 * *****************************************
*/

const { log, warn, error } = require("console")
const CONSTANTS = require("./constants")
const validator = require("./validator")
class Logger {
    constructor(options = {}) {

        this.formatOptions = {
            dateStyle: "short",
            timeStyle: "short",
            hour12: true,
        }

        if (validator(options)) {
            this.mode = options.mode || "none" // permitted: [node, std, exp]
            this.type = options.type || "info" // permitted: [info, warn, error, fatal]
            this.path = options.path || "none" //permitted: [none, console, file]
        } else {
            const date = new Date().toLocaleString("en-US", this.formatOptions)
            error(`[🍁 Err] ${date}: ${CONSTANTS.INVALID_INPUT}`)
            process.exit(1)
        }
    }

    log(message, options = {}) {
        if (!message || this.mode === "none")
            return;
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
        };


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