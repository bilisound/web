import React, { useState } from "react";
import type { GetBilisoundMetadataResponse } from "@/api/online";
import {
    Avatar, Box, Button, Grid, Heading, HStack, Image, Text,
} from "@chakra-ui/react";
import showMoreMask from "@/assets/show-more-mask.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { format } from "fecha";
import { getImageProxyUrl } from "@/utils/misc";

export interface SubmissionDetailProps {
    detail: GetBilisoundMetadataResponse
}

const SubmissionDetail: React.FC<SubmissionDetailProps> = ({ detail }) => {
    const [seeMore, setSeeMore] = useState(true);

    return (
        <Grid templateColumns={["1fr", "1fr", "1fr 1fr", "29rem 1fr"]} gap={6}>
            <div>
                <Image
                    objectFit="cover"
                    src={getImageProxyUrl(detail.pic, detail.bvid)}
                    alt={detail.title}
                    pos="relative"
                    zIndex={2}
                    borderRadius="0.5rem"
                    w="100%"
                    boxShadow="md"
                />
            </div>
            <div>
                <Heading as="h1" size="md" lineHeight={1.5} my="-0.25em">{detail.title}</Heading>
                <Grid gridTemplateColumns="2rem 1fr auto" gap={3} mt={4} mb={6}>
                    <Avatar
                        size="sm"
                        name={detail.owner.name}
                        src={getImageProxyUrl(detail.owner.face, detail.bvid)}
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
                        {detail.owner.name}
                    </Text>
                    <Text
                        as="time"
                        dateTime={new Date(detail.pubDate).toISOString()}
                        fontSize="sm"
                        lineHeight="2rem"
                    >
                        {format(new Date(detail.pubDate), "YYYY-MM-DD")}
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
                    >
                        {detail.desc.replaceAll("&amp;", "&")}
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
                <Box mt={6}>
                    <Button
                        as="a"
                        href={`https://www.bilibili.com/video/${detail.bvid}`}
                        target="_blank"
                        colorScheme="bilisound"
                        rightIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
                    >
                        观看源视频
                    </Button>
                </Box>
            </div>
        </Grid>
    );
};

export default SubmissionDetail;
