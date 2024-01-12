import { withProse } from "@nikolovlazar/chakra-ui-prose";
import type { ThemeConfig } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { modalTheme } from "../parts/modal";
import { switchTheme } from "../parts/switch";
import { BilisoundTheme } from "../types";

export const defaultTheme: BilisoundTheme = () => extendTheme(withProse(), {
    config: {
        initialColorMode: "system",
        useSystemColorMode: true,
    } as ThemeConfig,
    semanticTokens: {
        colors: {
            "chakra-body-bg": {
                _light: "white",
                _dark: "bilisound.975",
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
            50: "#eefffa",
            100: "#c6fff1",
            200: "#8effe6",
            300: "#4dfbd8",
            400: "#19e8c4",
            500: "#00ba9d",
            600: "#00a48e",
            700: "#028373",
            800: "#08675d",
            900: "#0c554d",
            950: "#003431",
            975: "#002624",
        },
    },
});

defaultTheme.themeName = "离韶绿";
defaultTheme.order = 1000;
