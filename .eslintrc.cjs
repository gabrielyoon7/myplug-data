module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        'linebreak-style': 0,
        'class-methods-use-this': 0,
        'no-undef': 0,
        'no-new': 0,
        'max-depth': ['error', 2],
        'max-lines-per-function': ['error', 10],
    }
}
