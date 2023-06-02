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
* */

module.exports = cacheConfig = {
    forceString: true,
    maxKeys: -1,
}