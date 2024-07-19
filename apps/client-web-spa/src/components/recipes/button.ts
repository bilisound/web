import { cva } from "@styled-system/css";

export const bsButton = cva({
    base: {
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        transition: "background-color",
        transitionDuration: "fast",
        gap: 2,
        "& > svg": {
            w: 4,
            h: 4,
        },
        _disabled: {
            cursor: "not-allowed",
            opacity: 0.5,
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
                    outline: "0.25rem solid",
                    outlineColor: "colorPalette.500/40",
                },
                _focus: {
                    outline: "0.25rem solid",
                    outlineColor: "colorPalette.500/40",
                },
            },
            ghost: {
                h: 10,
                px: 4,
                rounded: "lg",
                fontSize: "sm",
                color: "colorPalette.600",
                fontWeight: "600",
                bg: {
                    base: "transparent",
                    _hover: "colorPalette.950/5",
                    _active: "colorPalette.950/15",
                },
                _dark: {
                    color: "colorPalette.500",
                    bg: {
                        base: "transparent",
                        _hover: "colorPalette.50/5",
                        _active: "colorPalette.50/15",
                    },
                },
                _active: {
                    outline: "0.25rem solid",
                    outlineColor: {
                        base: "colorPalette.950/5",
                        _dark: "colorPalette.50/15",
                    },
                },
                _focus: {
                    outline: "0.25rem solid",
                    outlineColor: {
                        base: "colorPalette.950/5",
                        _dark: "colorPalette.50/5",
                    },
                },
            },
        },
        color: {
            plain: {
                colorPalette: "neutral",
            },
            primary: {
                colorPalette: "primary",
            },
            danger: {
                colorPalette: "danger",
            },
        },
    },
    compoundVariants: [
        {
            color: "plain",
            variant: "ghost",
            css: {
                color: {
                    base: "neutral.900",
                    _dark: "neutral.50",
                },
            },
        },
    ],
    defaultVariants: {
        variant: "primary",
        color: "primary",
    },
});

export const bsIconButton = cva({
    base: {
        colorPalette: "primary",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color",
        transitionDuration: "fast",
        "& > svg": {
            w: 4,
            h: 4,
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
                w: 10,
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
                w: 10,
                rounded: "lg",
                fontSize: "sm",
                color: "neutral.800",
                fontWeight: "600",
                bg: {
                    base: "transparent",
                    _hover: "colorPalette.950/10",
                    _active: "colorPalette.950/20",
                },
                _dark: {
                    color: "neutral.100",
                    bg: {
                        base: "transparent",
                        _hover: "colorPalette.50/10",
                        _active: "colorPalette.50/20",
                    },
                },
                _active: {
                    outline: "0.25rem solid",
                    outlineColor: {
                        base: "colorPalette.950/10",
                        _dark: "colorPalette.50/10",
                    },
                },
                _focus: {
                    outline: "0.25rem solid",
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
