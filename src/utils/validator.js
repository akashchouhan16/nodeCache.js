/*******************************************
 * copyright: nodeCache.js @github.com/akashchouhan16
 * author: @akashchouhan16
 * *****************************************
*/

const { error } = require("console")

module.exports = validator = (options = {}) => {
    let isModeValid = true
    let isPathValid = true
    const date = new Date().toLocaleString("en-US", this.formatOptions)

    //NOTE: options param is optionals, hence valid. 
    if (!options || options == {})
        return true
    let { mode, path } = options

    if (!mode || ["none", "std", "exp"].includes(mode)) {
        this.isModeValid = true
    } else {
        error(`[🍁 Err] ${date}: ${CONSTANTS.INVALID_MOD}`)
        this.isModeValid = false
    }

    if (!path || ["none", "console", "file"].includes(path)) {
        this.isPathValid = true
    } else {
        error(`[🍁 Err] ${date}: ${CONSTANTS.INVALID_PATH}`)
        this.isPathValid = false
    }

    return isModeValid && isPathValid
}