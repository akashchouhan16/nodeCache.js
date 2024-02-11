module.exports = {
    hooks: {
        'pre-commit': 'npm run lint && npm run lint-fix',
        'pre-push': 'npm test'
    }
};
