import React, { useState } from "react";
import {
    Avatar, Box, Grid, Heading, HStack, Image, Text,
} from "@chakra-ui/react";
import showMoreMask from "@/assets/show-more-mask.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { format } from "fecha";
import { InitialState } from "../../../types";

export interface SubmissionDetailProps {
    detail: InitialState
}

const SubmissionDetail: React.FC<SubmissionDetailProps> = ({ detail }) => {
    const [seeMore, setSeeMore] = useState(false); // 预留

    return (
        <Grid templateColumns={["1fr"]} gap={6}>
            <div>
                <Image
                    objectFit="cover"
                    boxShadow="md"
                    src={detail.videoData.pic}
                    alt={detail.videoData.title}
                    pos="relative"
                    zIndex={2}
                    borderRadius="0.5rem"
                    w="100%"
                />
            </div>
            <div>
                <Heading as="h1" size="md" lineHeight={1.5} my="-0.25em">{detail.videoData.title}</Heading>
                <Grid gridTemplateColumns="2rem 1fr auto" gap={3} mt={4} mb={6}>
                    <Avatar
                        size="sm"
                        name={detail.videoData.owner.name}
                        src={detail.videoData.owner.face}
                    />
                    <Text
                        fontSize="sm"
                        lineHeight="2rem"
                        fontWeight={600}
                        css={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            textAlign: "start",
                        }}
                    >
                        {detail.videoData.owner.name}
                    </Text>
                    <Text
                        as="time"
                        dateTime={new Date(detail.videoData.pubdate * 1000).toISOString()}
                        fontSize="sm"
                        lineHeight="2rem"
                    >
                        {format(new Date(detail.videoData.pubdate * 1000), "YYYY-MM-DD")}
                    </Text>
                </Grid>
                <Box css={{ position: "relative" }}>
                    <Text
                        whiteSpace="pre-wrap"
                        my="-0.25em"
                        css={{
                            maskImage: seeMore ? `url(${showMoreMask})` : "",
                            overflowY: seeMore ? "hidden" : undefined,
                            height: seeMore ? "9.5rem" : "",
                            position: "relative",
                            wordBreak: "break-all",
                            lineBreak: "anywhere",
                        }}
                        _selection={{
                            bg: "bilisound.900",
                            color: "bilisound.300",
                        }}
                        className="user-selectable"
                    >
                        {detail.videoData.desc.replaceAll("&amp;", "&")}
                    </Text>
                    {seeMore ? (
                        <Box
                            as="button"
                            position="absolute"
                            left={0}
                            bottom={0}
                            w="100%"
                            height={10}
                            fontWeight="bold"
                            color="bilisound.600"
                            cursor="pointer"
                            display="flex"
                            justifyContent="center"
                            onClick={() => setSeeMore(false)}
                        >
                            <HStack spacing={1}>
                                <span>查看更多</span>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </HStack>
                        </Box>
                    ) : ""}
                </Box>
                {/* <Box mt={6}>
                    <Button
                        colorScheme="bilisound"
                        rightIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
                        onClick={() => {
                            window.electron.ipcRenderer.send("openExternal", `https://www.bilibili.com/video/${detail.bvid}`);
                        }}
                    >
                        观看源视频
                    </Button>
                </Box> */}
            </div>
        </Grid>
    );
};

export default SubmissionDetail;
