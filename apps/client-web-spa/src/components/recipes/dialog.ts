import { sva } from "@styled-system/css";

export const bsDialog = sva({
    slots: ["overlay", "content", "title", "description", "actionGroup"],
    base: {
        overlay: {
            bg: "black/60",
            pos: "fixed",
            inset: 0,
            animationDuration: "300ms",
            zIndex: 1,
            '&[data-state="open"]': {
                animationName: "bsFadein",
            },
            '&[data-state="closed"]': {
                animationName: "bsFadeout",
            },
        },
        content: {
            bg: {
                base: "white",
                _dark: "neutral.900",
            },
            p: 6,
            rounded: "2xl",
            animationDuration: "300ms",
            pos: "fixed",
            left: "50%",
            top: "50%",
            w: "calc(100% - 2rem)",
            maxW: "sm",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            shadow: "2xl",
            '&[data-state="open"]': {
                animationName: "bsFadeinDialog",
            },
            '&[data-state="closed"]': {
                animationName: "bsFadeoutDialog",
            },
        },
        title: {
            fontSize: "lg",
            lineHeight: 1.5,
            fontWeight: 600,
        },
        description: {
            mt: 3,
            fontSize: "sm",
            lineHeight: 1.5,
        },
        actionGroup: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 2,
            mt: 6,
        },
    },
});
