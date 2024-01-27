/*******************************************
 * copyright: nodeCache.js @github.com/akashchouhan16
 * author: @akashchouhan16
 * *****************************************
*/

class Validator {
    #options
    #pathRegex
    constructor(options = null) {
        if (options && typeof options != "object") {
            this.#options = null
        } else {
            this.#options = { ...options }
        }
        this.#pathRegex = "*"
    }

    validate(options = null) {
        let _mode = null, _path = null
        if (options) {
            const { mode, path } = options
            _mode = mode
            _path = path
        } else {
            const { mode, path } = this.#options
            _mode = mode
            _path = path
        }

        if (!_mode && !_path)
            return false
        if (_mode && _path) {
            return this.#validateMode(_mode) && this.#validatePath(_path)
        }

        if (_mode) {
            return this.#validateMode(_mode)
        } else {
            return this.#validatePath(_path)
        }

    }

    #validateMode(mode) {
        if (mode) {
            // add checks to validate additional modes.
            if (typeof mode != "string" || ["none", "std", "exp"].includes(mode) == false)
                return false
            return true
        }
        return false
    }

    #validatePath(path) {
        if (path) {
            // add checks to valid path with file and console Regex.
            if (typeof path != "string" || ["none", "console", "file"].includes(path) == false)
                return false
            return true
        }
        return false
    }
}

module.exports = {
    Validator
}