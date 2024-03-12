import { cva } from "@/styled-system/css";

export const bsInput = cva({
    base: {
        colorPalette: "primary",
        border: "1px solid",
        borderColor: "bs-border",
        w: "full",
        h: 10,
        px: 3,
        py: 0,
        rounded: "lg",
        fontSize: "sm",
        bg: {
            base: "white",
            _dark: "neutral.800",
        },
        color: {
            base: "black",
            _dark: "white",
        },
        _active: {
            borderColor: "colorPalette.500",
            outline: "3px solid",
            outlineColor: "colorPalette.500/40",
        },
        _focus: {
            borderColor: "colorPalette.500",
            outline: "3px solid",
            outlineColor: "colorPalette.500/40",
        },
    },
});
