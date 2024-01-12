import React, { useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";
import {
    Box, Grid, Stack,
} from "@chakra-ui/react";
import { useBilisoundStore } from "../../../store/bilisoundStore";
import SubmissionDetail from "./SubmissionDetail";
import PartList from "./PartList";
import { VIEWPORT_HEIGHT_WITH_PLAYER } from "../../../constants";
import useScrollbarStyle from "../../../hooks/useScrollbarStyle";

const Result: React.FC = () => {
    // 内容
    const {
        detail,
    } = useBilisoundStore((state) => ({
        detail: state.detail,
    }), shallow);

    const scrollbarStyle = useScrollbarStyle();

    if (!detail) {
        return null;
    }

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = scrollAreaRef.current;
        if (!el) {
            return;
        }
        el.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [detail]);

    return (
        <Stack h={VIEWPORT_HEIGHT_WITH_PLAYER} spacing={0}>
            <Grid templateColumns="20rem 1fr" flex="1 1 auto" gap={0} minH={0}>
                <Box
                    overflowY="auto"
                    px={4}
                    pb={4}
                    css={scrollbarStyle}
                    ref={scrollAreaRef}
                >
                    <SubmissionDetail detail={detail} />
                </Box>
                <Box
                    minH={0}
                >
                    <PartList list={detail.videoData.pages} />
                </Box>
            </Grid>
        </Stack>
    );
};

export default Result;
