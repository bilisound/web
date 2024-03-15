import { cva } from "@/styled-system/css";

export const bsButton = cva({
    base: {
        colorPalette: "primary",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        transition: "background-color",
        transitionDuration: "fast",
        gap: 2,
        "& > svg": {
            w: 5,
            h: 5,
        },
        _disabled: {
            cursor: "not-allowed",
            opacity: 0.6,
        },
    },
    variants: {
        variant: {
            primary: {
                h: 10,
                px: 4,
                rounded: "lg",
                fontSize: "sm",
                color: "white",
                fontWeight: "600",
                bg: {
                    base: "colorPalette.600",
                    _hover: "colorPalette.500",
                    _active: "colorPalette.700",
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
            },
            ghost: {
                h: 10,
                px: 4,
                rounded: "lg",
                fontSize: "sm",
                color: "black",
                fontWeight: "600",
                bg: {
                    base: "transparent",
                    _hover: "colorPalette.950/10",
                    _active: "colorPalette.950/20",
                },
                _dark: {
                    color: "white",
                    bg: {
                        base: "transparent",
                        _hover: "colorPalette.50/10",
                        _active: "colorPalette.50/20",
                    },
                },
                _active: {
                    outline: "3px solid",
                    outlineColor: {
                        base: "colorPalette.950/10",
                        _dark: "colorPalette.50/10",
                    },
                },
                _focus: {
                    outline: "3px solid",
                    outlineColor: {
                        base: "colorPalette.950/10",
                        _dark: "colorPalette.50/10",
                    },
                },
            },
        },
    },
    defaultVariants: {
        variant: "primary",
    },
});
