import { withProse } from "@nikolovlazar/chakra-ui-prose";
import type { ThemeConfig } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { modalTheme } from "../parts/modal";
import { switchTheme } from "../parts/switch";
import { BilisoundTheme } from "../types";
import { leadTheme } from "./lead";

export const redTheme: BilisoundTheme = () => extendTheme(withProse(), {
    config: {
        initialColorMode: "system",
        useSystemColorMode: true,
    } as ThemeConfig,
    semanticTokens: {
        colors: {
            "chakra-body-bg": {
                _light: "white",
                _dark: "#181818",
            },
        },
    },
    components: {
        Modal: modalTheme,
        Drawer: modalTheme,
        Switch: switchTheme,
    },
    colors: {
        bilisound: {
            50: "#fff4ed",
            100: "#ffe6d4",
            200: "#ffc8a8",
            300: "#ffa270",
            400: "#ff6f37",
            500: "#ff5722",
            600: "#f02e06",
            700: "#c71e07",
            800: "#9e1a0e",
            900: "#7f190f",
            950: "#450805",
            975: "#350604",
        },
    },
});

redTheme.themeName = "法拉利红";
redTheme.order = 2000;
