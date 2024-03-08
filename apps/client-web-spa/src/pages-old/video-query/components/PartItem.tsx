import React from "react";
import type { GetBilisoundMetadataResponse } from "@/api/online";
import {
    Box, Center, Tag, useColorModeValue,
} from "@chakra-ui/react";
import { shallow } from "zustand/shallow";
import { useBilisoundStore } from "@/store/bilisoundStore";
import { secondToTimestamp } from "@bilisound2/utils";
import { BASE_LINE_HEIGHT } from "@/pages/constants";

export interface PartItemProps {
    item: GetBilisoundMetadataResponse["pages"][number]
}

const PartItem: React.FC<PartItemProps> = ({ item }) => {
    // 内容
    const {
        playingEpisode,
        setPlayingEpisode,
    } = useBilisoundStore((state) => ({
        playingEpisode: state.playingEpisode,
        setPlayingEpisode: state.setPlayingEpisode,
    }), shallow);

    const isPlaying = playingEpisode === item.page;

    return (
        <Box
            as="li"
            display="block"
            borderBottom="1px solid"
            borderColor={useColorModeValue("blackAlpha.200", "whiteAlpha.300")}
            _last={{
                border: 0,
            }}
        >
            <Box
                as="button"
                onClick={() => setPlayingEpisode(item.page)}
                width="100%"
                height={`${BASE_LINE_HEIGHT}px`}
                display="grid"
                gridTemplateColumns="auto 1fr auto"
                gap={3}
                css={{
                    "> *": {
                        height: "100%",
                    },
                }}
            >
                <Center>
                    <Tag colorScheme="bilisound" fontWeight={700} variant={isPlaying ? "solid" : undefined} fontFamily="'Roboto', sans-serif">{item.page}</Tag>
                </Center>
                <Box
                    css={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        textAlign: "start",
                        lineHeight: `${BASE_LINE_HEIGHT}px`,
                    }}
                    fontWeight={isPlaying ? "bold" : "normal"}
                    color={isPlaying ? "bilisound.500" : ""}
                >
                    {item.part}
                </Box>
                <Center>
                    <Tag colorScheme="bilisound" fontWeight="500" fontFamily="'Roboto', sans-serif">{secondToTimestamp(item.duration, { showMillisecond: false })}</Tag>
                </Center>
            </Box>
        </Box>
    );
};

export default PartItem;
