/*******************************************
 * copyright: nodeCache.js @github.com/akashchouhan16
 * author: @akashchouhan16
 * *****************************************
*/

module.exports = CONSTANTS = {
    INVALID_MOD: `Invalid mode value. Only "none", "std", or "exp" are allowed`,
    INVALID_TYPE: `Invalid type value. Only "default", "info", "warn", "error", or "fatal" are allowed`,
    INVALID_PATH: `Invalid path value. Only "none", "console", or "file" are allowed`,
    INVALID_INPUT: `Invalid inputs, nodeCache has been terminated`,
    INIT: `nodeCache.js Initialized`,
    INVALID_KEY_VALUE: `Invalid key and value. Only number, string, or object type allowed`,
    INVALID_KEY_TYPE: `Invalid key provided. key must be of numeric or string type`,
    INVALID_VALUE_TYPE: `Invalid value provided. Only number, string, or object type allowed`,
    INVALID_TTL_TYPE: `Invalid ttl provided. ttl must be of numeric type in milliseconds(ms)`,
    TERMINATE_MODE_EXP: `Process terminated due to fatal error. NodeCache mode is set to "exp"`,
    INVALID_GETM_INPUT: `Invalid keys. Expecting an array of key:string`,
    INVALID_SETM_INPUT: `Invalid values. Expected an array of <key,value> pairs`,
    MAX_CACHE_LIMIT: `Cannot set values, Cache max limit hit`,
    ITEM_NOTFOUND: `No item not found with the provided key`,
    WORKER_ERROR: `Error with the worker thread`
}