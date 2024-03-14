import { defineConfig } from "@pandacss/dev";
import typographyPreset from "pandacss-preset-typography";

export default defineConfig({
    // Whether to use css reset
    preflight: true,

    presets: [
        typographyPreset({
            recipe: {
                semanticTokens: {
                    defaults: false,
                },
            },
        }),
        // Re-add the panda presets if you want to keep
        // the default keyframes, breakpoints, tokens
        // and textStyles provided by PandaCSS
        "@pandacss/dev/presets",
    ],

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
            color: {
                base: "black",
                _dark: "neutral.50",
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
            fonts: {
                roboto: {
                    value: "Roboto, sans-serif",
                },
            },
            sizes: {
                container: {
                    value: "60rem",
                },
            },
            colors: {
                "bs-border": {
                    value: {
                        base: "{colors.neutral.200}",
                        _dark: "{colors.neutral.700}",
                    },
                },
                prose: {
                    body: {
                        value: {
                            base: "{colors.neutral.700}",
                            _dark: "{colors.neutral.300}",
                        },
                    },
                    heading: {
                        value: {
                            base: "{colors.neutral.900}",
                            _dark: "{colors.neutral.100}",
                        },
                    },
                    lead: {
                        value: {
                            base: "{colors.neutral.600}",
                            _dark: "{colors.neutral.400}",
                        },
                    },
                    link: {
                        value: {
                            base: "{colors.neutral.900}",
                            _dark: "{colors.neutral.100}",
                        },
                    },
                    bold: {
                        value: {
                            base: "{colors.neutral.900}",
                            _dark: "{colors.neutral.100}",
                        },
                    },
                    counter: {
                        value: "{colors.neutral.500}",
                    },
                    bullet: {
                        value: {
                            base: "{colors.neutral.300}",
                            _dark: "{colors.neutral.700}",
                        },
                    },
                    hrBorder: {
                        value: {
                            base: "{colors.neutral.200}",
                            _dark: "{colors.neutral.800}",
                        },
                    },
                    quote: {
                        value: {
                            base: "{colors.neutral.900}",
                            _dark: "{colors.neutral.100}",
                        },
                    },
                    quoteBorder: {
                        value: {
                            base: "{colors.neutral.200}",
                            _dark: "{colors.neutral.800}",
                        },
                    },
                    caption: {
                        value: "{colors.neutral.500}",
                    },
                    kbd: {
                        value: {
                            base: "{colors.neutral.900}",
                            _dark: "{colors.neutral.100}",
                        },
                    },
                    kbdShadow: {
                        // Expects an RGB value
                        value: "0 0 0",
                    },
                    code: {
                        value: {
                            base: "{colors.neutral.900}",
                            _dark: "{colors.neutral.100}",
                        },
                    },
                    preCode: {
                        value: {
                            base: "{colors.neutral.200}",
                            _dark: "{colors.neutral.800}",
                        },
                    },
                    preBg: {
                        value: {
                            base: "{colors.neutral.800}",
                            _dark: "{colors.neutral.200}",
                        },
                    },
                    thBorder: {
                        value: {
                            base: "{colors.neutral.300}",
                            _dark: "{colors.neutral.700}",
                        },
                    },
                    tdBorder: {
                        value: {
                            base: "{colors.neutral.200}",
                            _dark: "{colors.neutral.800}",
                        },
                    },
                },
            },
        },
    },

    // The output directory for your css system
    outdir: "src/styled-system",
});