import React, { useEffect } from "react";
import {
    Box,
} from "@chakra-ui/react";
import PartItem from "@/views/_index/components/PartItem";
import { BASE_LINE_HEIGHT } from "@/views/_index/constants";
import { sliceMap } from "@bilisound2/utils";
import { InitialState } from "../../../types";
import useScrollbarStyle from "../../../hooks/useScrollbarStyle";
import useVirtualList from "../../../hooks/useVirtualList";

export interface PartListProps {
    list: InitialState["videoData"]["pages"]
}

const PartList: React.FC<PartListProps> = ({ list }) => {
    const {
        holderRef,
        holderParentRef,
        size,
        begin,
    } = useVirtualList({
        baseItemHeight: BASE_LINE_HEIGHT,
    });

    const scrollbarStyle = useScrollbarStyle();

    useEffect(() => {
        holderRef.current?.scrollTo({
            top: 0,
        });
    }, [list]);

    return (
        <Box
            css={{
                position: "relative",
                ...scrollbarStyle,
            }}
            h="100%"
            px={4}
            overflowY="scroll"
            ref={holderParentRef}
        >
            <Box
                style={{
                    height: `${list.length * BASE_LINE_HEIGHT}px`,
                } as React.CSSProperties}
                ref={holderRef}
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
        </Box>
    );
};

export default PartList;
