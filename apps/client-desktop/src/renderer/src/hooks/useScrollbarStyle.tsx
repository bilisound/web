import { useColorModeValue } from "@chakra-ui/react";

export default function useScrollbarStyle() {
    const scrollbarThumbColor = useColorModeValue("var(--chakra-colors-blackAlpha-300)", "var(--chakra-colors-whiteAlpha-300)");

    const scrollbarThumbHoverColor = useColorModeValue("var(--chakra-colors-blackAlpha-500)", "var(--chakra-colors-whiteAlpha-500)");

    return {
        paddingTop: "0.2rem",
        "::-webkit-scrollbar": {
            width: "1rem",
            height: "1rem",
            background: "var(--chakra-colors-chakra-body-bg)",
        },
        "::-webkit-scrollbar-thumb": {
            background: scrollbarThumbColor,
            borderRadius: "0.5rem",
            border: "0.2rem solid var(--chakra-colors-chakra-body-bg)",
            transition: "0.3s",
        },
        "::-webkit-scrollbar-track:vertical": {},
        "::-webkit-scrollbar-track": {},
        "::-webkit-scrollbar-thumb:hover": {
            background: scrollbarThumbHoverColor,
        },
    };
}
