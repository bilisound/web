import { extendTheme } from "@chakra-ui/react";
import * as themes from "@bilisound2/theme";
import { TITLE_BAR_HEIGHT } from "../constants";

export type ThemeName = keyof typeof themes;

export default function getTheme(themeName: ThemeName) {
    return extendTheme(themes[themeName], {
        styles: {
            global: {
                "div[id^=chakra-toast-manager-top]": {
                    top: `calc(env(safe-area-inset-top, 0px) + ${TITLE_BAR_HEIGHT}) !important`,
                },
            },
        },
    });
}
