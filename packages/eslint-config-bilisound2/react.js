import globals from "globals";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";

export default [
    { languageOptions: { globals: globals.browser } },
    ...fixupConfigRules(pluginReactConfig),
    {
        rules: {
            // https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
];
