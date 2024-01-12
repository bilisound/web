import React from "react";
import backgroundCorner from "@/assets/bg-corner.svg";
import { Box, useColorModeValue } from "@chakra-ui/react";

const YuruChara: React.FC = () => (
    <Box
        aria-hidden
        w="250px"
        h="250px"
        position="fixed"
        right="0"
        bottom="min(calc(100dvh / 2 - 125px), 125px)"
        background={`url(${backgroundCorner})`}
        zIndex={1}
        opacity={useColorModeValue(0.3, 0.25)}
        pointerEvents="none"
        mixBlendMode={useColorModeValue("multiply", "lighten")}
    />
);
export default YuruChara;
