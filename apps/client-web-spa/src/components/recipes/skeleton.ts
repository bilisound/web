import { cva } from "@/styled-system/css";

export const bsSkeleton = cva({
    base: {
        display: "block",
        bg: {
            base: "neutral.200",
            _dark: "neutral.800",
        },
    },
    variants: {
        variant: {
            normal: {},
            circle: {
                rounded: "full",
            },
        },
    },
    defaultVariants: {
        variant: "normal",
    },
});
