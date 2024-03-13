import { cva } from "@/styled-system/css";

export const bsButton = cva({
    base: {
        colorPalette: "primary",
        h: 10,
        px: 4,
        rounded: "lg",
        fontSize: "sm",
        transition: "background-color",
        transitionDuration: "fast",
        cursor: "pointer",
        color: "white",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: 2,
        bg: {
            base: "colorPalette.600",
            _hover: "colorPalette.500",
            _active: "colorPalette.700",
        },
        "& > svg": {
            w: 5,
            h: 5,
        },
        _dark: {
            bg: {
                base: "colorPalette.700",
                _hover: "colorPalette.600",
                _active: "colorPalette.800",
            },
        },
        _active: {
            outline: "3px solid",
            outlineColor: "colorPalette.500/40",
        },
        _focus: {
            outline: "3px solid",
            outlineColor: "colorPalette.500/40",
        },
        _disabled: {
            cursor: "not-allowed",
            opacity: 0.6,
        },
    },
});
