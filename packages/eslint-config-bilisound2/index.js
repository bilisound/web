/** @type {import("eslint").Linter.Config} */
module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "plugin:react/recommended",
        "airbnb",
    ],
    plugins: [
        "react",
    ],
    rules: {
        "no-new": "off",
        "no-console": "off",
        "no-debugger": "off",
        "no-plusplus": "off",
        "no-param-reassign": "off",
        "prefer-destructuring": "off",
        "import/prefer-default-export": "off",
        "class-methods-use-this": "off",
        "import/no-cycle": "off",
        "max-len": "off",
        "no-await-in-loop": "off",
        "import/no-extraneous-dependencies": "off",
        indent: ["warn", 4, { SwitchCase: 1 }],
        quotes: ["error", "double"],
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                js: "never",
                cjs: "never",
                mjs: "never",
                jsx: "never",
                ts: "never",
                tsx: "never",
            },
        ],
        "react/jsx-indent": ["warn", 4],
        "react/jsx-indent-props": ["warn", 4],
        "react/jsx-props-no-spreading": "off",
        "react/function-component-definition": [
            "warn",
            {
                namedComponents: "arrow-function",
                unnamedComponents: "arrow-function",
            },
        ],
        "jsx-a11y/aria-proptypes": "off",
        "jsx-a11y/media-has-caption": "off",
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            extends: [
                "airbnb-typescript",
            ],
            parserOptions: {
                project: ['./tsconfig.json'],
            },
            rules: {
                "@typescript-eslint/ban-types": "off",
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-empty-function": "off",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/no-var-requires": "off",
                "@typescript-eslint/indent": ["warn", 4, { SwitchCase: 1 }],
                "@typescript-eslint/quotes": ["error", "double"],
            }
        },
    ],
};
