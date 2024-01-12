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
};
