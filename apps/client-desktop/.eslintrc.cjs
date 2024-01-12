/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        "bilisound2",
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.web.json",
    },
    settings: {
        "import/resolver": {
            alias: {
                map: [["@", "./src/renderer/src"]],
                extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx"],
            },
        },
    },
    overrides: [
        {
            files: [
                "electron.vite.config.*",
                "src/main/*",
                "src/main/*/**",
                "src/preload/*",
                "build/*",
                ".eslintrc.cjs",
            ],
            parserOptions: {
                project: "./tsconfig.node.json",
            },
        },
        {
            files: [
                "electron.vite.config.*",
                "build/*",
                ".eslintrc.cjs",
            ],
            rules: {
                "import/no-extraneous-dependencies": "off",
            },
        },
    ],
};
