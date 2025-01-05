module.exports = {
    extends: [
        "standard",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    rules: {
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "prettier/prettier": [
            "error",
            {
                printWidth: 80,
                tabWidth: 4,
                singleQuote: false,
                trailingComma: "all",
                arrowParens: "always",
                semi: true,
            },
        ],
        "linebreak-style": ["error", "unix"],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "no-useless-constructor": "off",
        "no-use-before-define": "off",
        "no-new": "off",
    },
    settings: {
        "import/parsers": {
            [require.resolve("@typescript-eslint/parser")]: [
                ".ts",
                ".tsx",
                ".d.ts",
            ],
        },
    },
};
