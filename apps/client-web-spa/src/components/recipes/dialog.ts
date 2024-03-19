import { cva } from "@/styled-system/css";

export const bsDialogOverlay = cva({
    base: {
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
});

export const bsDialogContent = cva({
    base: {
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
});

export const bsDialogTitle = cva({
    base: { fontSize: "lg", lineHeight: 1.5, fontWeight: 600 },
});

export const bsDialogDescription = cva({
    base: { mt: 3, fontSize: "sm", lineHeight: 1.5 },
});

export const bsDialogActionGroup = cva({
    base: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2, mt: 6 },
});
