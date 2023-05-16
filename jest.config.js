
/** @type {import('jest').Config} */

const config = {
    displayName: {
        name: 'nodeCache Unit Tests',
        color: 'magentaBright'
    },
    forceCoverageMatch: ['**/*.test.js'],
    testEnvironment: 'node',
};

module.exports = config;