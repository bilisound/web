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
        bottom="150px"
        background={`url(${backgroundCorner})`}
        zIndex={1}
        opacity={0.3}
        pointerEvents="none"
        mixBlendMode={useColorModeValue("multiply", "lighten")}
    />
);
export default YuruChara;
