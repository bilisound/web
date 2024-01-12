import React from "react";
import { Center, useColorModeValue } from "@chakra-ui/react";

const AdsToolTop: React.FC = () => {
    // 动态颜色样式
    const dynamicColors = useColorModeValue(
        {
            adBackground: "blackAlpha.200",
        },
        {
            adBackground: "whiteAlpha.200",
        },
    );

    return (
        <Center background={dynamicColors.adBackground} borderRadius="0.5rem" height="10rem">广告位（暂定）</Center>
    );
};

export default AdsToolTop;
