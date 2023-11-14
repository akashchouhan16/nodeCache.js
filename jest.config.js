/*******************************************
 * copyright: nodeCache.js @github.com/akashchouhan16
 * author: @akashchouhan16
 * *****************************************
*/

/** @type {import("jest").Config} */

const config = {
    displayName: {
        name: "NodeCache.js (npm package) Unit Tests",
        color: "cyan"
    },
    verbose: true,
    bail: 1,
    forceCoverageMatch: ["**/*.test.js"],
    testEnvironment: "node",
}

module.exports = config