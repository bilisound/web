/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        require.resolve('umi/eslint'),
        "plugin:prettier/recommended"
    ],
    rules: {
        "react/no-unknown-property": ['error', { ignore: ['fetchpriority'] }]
    }
};
