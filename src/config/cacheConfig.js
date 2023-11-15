/*******************************************
 * copyright: nodeCache.js @github.com/akashchouhan16
 * author: @akashchouhan16
 * *****************************************
*/


/** NOTE on cacheConfig values
 * forceString: All i/p values are stored as a string type when set to true.
                Accepts boolean. Setting this to false would preserve the i/p original type (number, object)
 
 * maxKeys: To configure a max cache limit for an instance. Default is -1 (~1mil key limit).
            Accepts numeric data (>0). Setting maxKeys will add a cache limit to the instance.

 * stdTTL: To configure a default ttl with every key value pair saved to the cache instance.
           Accepts numeric data in ms (>0). Setting stdTTL, will overwrite default ttl = 0 to stdTTL value.
           stdTTL value of 0 implies ttl is infinite and the key-value will never expire from cache.

* valueOnly: To configure the response from the get() and getM() API.
             Accepts boolean. By default, it's set to true and get calls will only the associated value for a key.
             When set to false, get() or its derivative getM() call will return {value, ttl} object for a particular key.
* */

let cacheConfig = {
    forceString: true,
    valueOnly: true,
    maxKeys: -1,
    stdTTL: 0,

    // Global Stats for the cache
    cacheHit: 0,
    cacheMiss: 0,
    keyCount: 0,
}

module.exports = cacheConfig