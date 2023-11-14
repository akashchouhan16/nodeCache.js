module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true,
        "jest/globals": true
    },
    plugins: ["jest"],
    "extends": "eslint:recommended",
    "overrides": [
        {
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "ignorePatterns": ["/dist/", "/tests/", "/*.mjs"],
    "rules": {
        quotes: ["error", "double", { "allowTemplateLiterals": true }],
        "semi": ["warn", "never"]
    }
}
