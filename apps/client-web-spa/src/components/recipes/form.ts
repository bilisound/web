import { sva } from "@/styled-system/css";

export const bsForm = sva({
    slots: ["root", "item", "label", "value", "error"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
        },
        item: {
            display: "flex",
            w: "full",
        },
        label: {
            lineHeight: 1.5,
            py: 1,
            fontSize: "sm",
            flex: "none",
            color: {
                base: "black",
                _dark: "white",
            },
        },
        value: {
            w: "full",
            flex: "auto",
            minW: 0,
        },
        error: {
            lineHeight: "1.5rem",
            fontSize: "xs",
            color: "red.500",
            truncate: true,
        },
    },
    variants: {
        direction: {
            vertical: {
                root: { gap: 0 },
                item: {
                    flexDirection: "column",
                    alignItems: "flex-start",
                },
                value: {
                    pos: "static",
                    pb: 4,
                    "&:has([data-error]):not(:has([data-error]:empty))": {
                        pb: 0,
                    },
                },
                error: {
                    pos: "static",
                },
            },
            horizontal: {
                root: { gap: 6 },
                item: {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                },
                value: {
                    pos: "relative",
                },
                error: {
                    pos: "absolute",
                    insetInlineStart: 0,
                    bottom: 0,
                    transform: "translateY(100%)",
                },
            },
        },
        align: {
            start: {
                label: { textAlign: "start" },
            },
            end: {
                label: { textAlign: "end" },
            },
        },
        required: {
            true: {
                label: {
                    "&::before": {
                        content: '"* "',
                        color: "red.500",
                    },
                },
            },
            false: {},
        },
    },
    defaultVariants: {
        direction: "vertical",
        align: "start",
        required: false,
    },
});
