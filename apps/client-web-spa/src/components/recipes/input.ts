import { cva } from "@/styled-system/css";

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
            border: "1px solid token(colors.colorPalette.300)",
            outline: "0.25rem solid token(colors.colorPalette.300)",
        },
        _focus: {
            border: "1px solid token(colors.colorPalette.300)",
            outline: "0.25rem solid token(colors.colorPalette.300)",
        },
        _placeholder: {
            color: {
                base: "neutral.500",
                _dark: "neutral.700",
            },
        },
        _dark: {
            _active: {
                border: "1px solid token(colors.colorPalette.700)",
                outline: "0.25rem solid token(colors.colorPalette.700)",
            },
            _focus: {
                border: "1px solid token(colors.colorPalette.700)",
                outline: "0.25rem solid token(colors.colorPalette.700)",
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
