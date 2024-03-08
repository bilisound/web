import React from "react";
import {
    Box,
} from "@chakra-ui/react";
import type { GetBilisoundMetadataResponse } from "@/api/online";
import useVirtualList from "@/hooks/useVirtualList";
import { sliceMap } from "@bilisound2/utils";
import { BASE_LINE_HEIGHT } from "@/pages/constants";
import PartItem from "@/pages/video-query/components/PartItem";

export interface PartListProps {
    list: GetBilisoundMetadataResponse["pages"]
}

const PartList: React.FC<PartListProps> = ({ list }) => {
    const { holderRef, begin, size } = useVirtualList({
        baseItemHeight: BASE_LINE_HEIGHT,
    });
    return (
        <Box
            style={{
                height: `${list.length * BASE_LINE_HEIGHT}px`,
            } as React.CSSProperties}
            css={{
                position: "relative",
            }}
            // bg="blue.500"
            ref={holderRef}
            mt={6}
        >
            <Box
                as="ul"
                style={{
                    transform: `translateY(${begin * BASE_LINE_HEIGHT}px)`,
                }}
                css={{
                    display: "block",
                }}
                // bg="red.500"
            >
                {sliceMap(list, begin, begin + size, (e, index, original) => (
                    <PartItem key={e.page} item={e} />
                ))}
            </Box>
        </Box>
    );
};

export default PartList;
