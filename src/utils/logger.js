/**
 * author: @akashchouhan16
 * copyright: 2023 nodeCache @github.com/akashchouhan16
 * */

class Logger {
    constructor(options = {}) {
        this.mode = options.mode || "std" // allowed: [std, exp]
        this.type = options.type || "info" // allowed: [info, warn, error, fatal]
    }

    log(message, options = {}) {
        //TODO
    }
}

module.exports = Logger