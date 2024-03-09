import { defineConfig } from "@pandacss/dev";

export default defineConfig({
    // Whether to use css reset
    preflight: true,

    // Where to look for your css declarations
    include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

    // Files to exclude
    exclude: [],

    globalCss: {
        body: {
            bg: {
                base: "white",
                _dark: "neutral.900",
            },
        },
    },

    // Useful for theme customization
    theme: {
        extend: {
            keyframes: {
                bsFadeinLeft: {
                    "0%": { opacity: "0", transform: "translateX(-2px)" },
                    "100%": { opacity: "1" },
                },
                bsFadeoutLeft: {
                    "0%": { opacity: "1" },
                    "100%": { opacity: "0", transform: "translateX(-2px)" },
                },
                bsFadeinRight: {
                    "0%": { opacity: "0", transform: "translateX(2px)" },
                    "100%": { opacity: "1" },
                },
                bsFadeoutRight: {
                    "0%": { opacity: "1" },
                    "100%": { opacity: "0", transform: "translateX(2px)" },
                },
                bsFadeinTop: {
                    "0%": { opacity: "0", transform: "translateY(-2px)" },
                    "100%": { opacity: "1" },
                },
                bsFadeoutTop: {
                    "0%": { opacity: "1" },
                    "100%": { opacity: "0", transform: "translateY(-2px)" },
                },
                bsFadeinBottom: {
                    "0%": { opacity: "0", transform: "translateY(2px)" },
                    "100%": { opacity: "1" },
                },
                bsFadeoutBottom: {
                    "0%": { opacity: "1" },
                    "100%": { opacity: "0", transform: "translateY(2px)" },
                },
            },
            tokens: {
                colors: {
                    primary: {
                        "50": { value: "#eefffa" },
                        "100": { value: "#c6fff1" },
                        "200": { value: "#8effe6" },
                        "300": { value: "#4dfbd8" },
                        "400": { value: "#19e8c4" },
                        "500": { value: "#00ba9d" },
                        "600": { value: "#00a48e" },
                        "700": { value: "#028373" },
                        "800": { value: "#08675d" },
                        "900": { value: "#0c554d" },
                        "950": { value: "#003431" },
                    },
                },
            },
        },
        semanticTokens: {
            sizes: {
                container: {
                    value: "60rem",
                },
            },
        },
    },

    // The output directory for your css system
    outdir: "styled-system",
});
