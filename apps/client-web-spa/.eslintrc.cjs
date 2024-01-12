/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        "bilisound2",
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
    },
    settings: {
        "import/resolver": {
            alias: {
                map: [["@", "./src"]],
                extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx"],
            },
        },
    },
    rules: {
        // https://github.com/import-js/eslint-plugin-import/issues/1174#issuecomment-1652629153
        'import/no-extraneous-dependencies': [
            1,
            {
                devDependencies: false,
                includeInternal: false,
                includeTypes: false,
                packageDir: ['.', '../..'], // <--- the key addition
            },
        ],
    },
};
