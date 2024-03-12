import { cva } from "@/styled-system/css";

export const bsForm = cva({
    base: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    variants: {
        direction: {
            vertical: {
                gap: 0,
            },
            horizontal: {
                gap: 6,
            },
        },
    },
    defaultVariants: {
        direction: "vertical",
    },
});

export const bsFormItem = cva({
    base: {
        display: "flex",
        w: "full",
    },
    variants: {
        direction: {
            vertical: {
                flexDirection: "column",
                alignItems: "flex-start",
            },
            horizontal: {
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
            },
        },
    },
    defaultVariants: {
        direction: "vertical",
    },
});

export const bsFormLabel = cva({
    base: {
        lineHeight: 1.5,
        py: 1,
        fontSize: "sm",
        flex: "none",
        color: {
            base: "black",
            _dark: "white",
        },
    },
    variants: {
        align: {
            start: {
                textAlign: "start",
            },
            end: {
                textAlign: "end",
            },
        },
        required: {
            true: {
                "&::before": {
                    content: '"* "',
                    color: "red.500",
                },
            },
            false: {},
        },
    },
    defaultVariants: {
        align: "start",
        required: false,
    },
});

export const bsFormValue = cva({
    base: {
        w: "full",
        flex: "auto",
        minW: 0,
    },
    variants: {
        direction: {
            vertical: {
                pos: "static",
                pb: 4,
                "&:has([data-error]):not(:has([data-error]:empty))": {
                    pb: 0,
                },
            },
            horizontal: {
                pos: "relative",
            },
        },
    },
    defaultVariants: {
        direction: "vertical",
    },
});

export const bsFormError = cva({
    base: {
        lineHeight: "1.5rem",
        fontSize: "xs",
        color: "red.500",
        truncate: true,
    },
    variants: {
        direction: {
            vertical: {
                pos: "static",
            },
            horizontal: {
                pos: "absolute",
                insetInlineStart: 0,
                bottom: 0,
                transform: "translateY(100%)",
            },
        },
    },
    defaultVariants: {
        direction: "vertical",
    },
});
