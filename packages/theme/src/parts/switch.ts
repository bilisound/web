import { switchAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
    track: {
        _checked: {
            bg: "bilisound.500",
            _dark: "bilisound.500",
        },
    },
});

export const switchTheme = defineMultiStyleConfig({
    baseStyle,
});
