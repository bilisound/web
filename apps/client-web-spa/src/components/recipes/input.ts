import { cva } from "@styled-system/css";

export const bsInput = cva({
    base: {
        border: {
            base: "1px solid token(colors.colorPalette.300)",
            _dark: "1px solid token(colors.colorPalette.700)",
        },
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
            border: {
                base: "1px solid token(colors.colorPalette.500)",
                _dark: "1px solid token(colors.colorPalette.500)",
            },
            boxShadow: {
                base: "0 0 0 1px token(colors.colorPalette.500)",
                _dark: "0 0 0 1px token(colors.colorPalette.500)",
            },
            outline: 0,
        },
        _focus: {
            border: {
                base: "1px solid token(colors.colorPalette.500)",
                _dark: "1px solid token(colors.colorPalette.500)",
            },
            boxShadow: {
                base: "0 0 0 1px token(colors.colorPalette.500)",
                _dark: "0 0 0 1px token(colors.colorPalette.500)",
            },
            outline: 0,
        },
        _placeholder: {
            color: {
                base: "neutral.500",
                _dark: "neutral.700",
            },
        },
    },
    variants: {
        color: {
            primary: { colorPalette: "primary" },
            danger: { colorPalette: "red" },
            plain: { colorPalette: "neutral" },
        },
    },
    defaultVariants: {
        color: "primary",
    },
});
