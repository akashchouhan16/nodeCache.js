/*******************************************
 * copyright: nodeCache.js @github.com/akashchouhan16
 * author: @akashchouhan16
 * *****************************************
*/

const { parentPort, isMainThread } = require('worker_threads');

// Listen for most recent cache context from the Main Thread.

if (!isMainThread) {
    parentPort.on('message', ({ cache, logger, action }) => {
        try {
            const now = Date.now()
            console.log(logger.log)
            for (const [key, cacheItem] of Object.entries(cache)) {
                if (cacheItem.ttl && Number(cacheItem.ttl) < Number(now)) {
                    // Send key with expired ttl to Main Thread for cache eviction.
                    parentPort.postMessage({ key });
                }
            }
        } catch (error) {

        }
    })
}