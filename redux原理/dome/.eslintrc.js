module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react-hooks", "react"],
    env: {
        browser: true,
        es6: true
    },
    extends: [
        //"airbnb",
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
        //"plugin:prettier/recommended"
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        U: true,
        require: true
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2018,
        sourceType: "module",
        jsx: true,
        useJSXTextNode: true
    },
    rules: {
        "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
        "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
        "@typescript-eslint/rule-name": "error",
        camelcase: "off",
        "@typescript-eslint/camelcase": [0, { properties: "never" }],
        "@typescript-eslint/explicit-function-return-type": [0, { properties: "never" }],
        "@typescript-eslint/no-unused-vars": [0, { properties: "never" }],
        "@typescript-eslint/rule-name": [0, { properties: "never" }],
        "@typescript-eslint/interface-name-prefix": [
            2,
            { prefixWithI: "always", allowUnderscorePrefix: true }
        ]
    },
    settings: {
        "import/resolver": {
            webpack: { config: "./build/webpack.base.config.js" }
        }
    }
};
