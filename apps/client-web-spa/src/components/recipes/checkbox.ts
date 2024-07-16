import { sva } from "@styled-system/css";

export const bsCheckbox = sva({
    slots: ["input", "display"],
    base: {
        input: {
            srOnly: true,
        },
        display: {
            pos: "relative",
            w: "11",
            h: "6",
            bgColor: "neutral.200",
            _peerFocus: { ring: "none", ringOffset: "none", shadow: "4" },
            rounded: "full",
            _dark: { bgColor: "neutral.700", borderColor: "neutral.600" },
            _after: {
                _peerChecked: {
                    content: "''",
                    transform: "translateX(100%)",
                    _rtl: {
                        content: "''",
                        transform: "translateX(-100%)",
                    },
                    borderColor: "white",
                },
                content: "''",
                pos: "absolute",
                top: "2px",
                insetInlineStart: "2px",
                bgColor: "white",
                borderColor: "neutral.300",
                borderWidth: "1px",
                rounded: "full",
                w: "5",
                h: "5",
                transitionDuration: "slow",
            },
            _peerChecked: { bgColor: "primary.600" },
        },
    },
});
