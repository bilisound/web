import { withProse } from "@nikolovlazar/chakra-ui-prose";
import type { ThemeConfig } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { modalTheme } from "../parts/modal";
import { switchTheme } from "../parts/switch";
import { BilisoundTheme } from "../types";

export const leadTheme: BilisoundTheme = () => extendTheme(withProse(), {
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
            50: "#edfaff",
            100: "#d7f1ff",
            200: "#b9e8ff",
            300: "#88ddff",
            400: "#50c7ff",
            500: "#28a9ff",
            600: "#1890ff",
            700: "#0a73eb",
            800: "#0f5cbe",
            900: "#135095",
            950: "#11315a",
            975: "#0c2340",
        },
    },
});

leadTheme.themeName = "蚂蚁蓝";
leadTheme.order = 3000;
