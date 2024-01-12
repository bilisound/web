import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faBan, faCheck, faCircleExclamation, faDownload, faFileAudio, faPause,
} from "@fortawesome/free-solid-svg-icons";
import {
    Center, Grid, HStack, Progress, VStack, Text, TextProps, Button, ButtonProps, Box, Link, useColorModeValue,
} from "@chakra-ui/react";
import { toHumanReadableSize } from "@bilisound2/utils";
import { jsxIf } from "@bilisound2/utils/dist/jsx";
import { Link as RouterLink } from "react-router-dom";
import base64url from "base64url";
import { BilisoundDownloadItemDisplay } from "../../../common";
import { AriaStatusString } from "../utils/rpc-client";

export interface DownloadManagerItemProps {
    item: BilisoundDownloadItemDisplay
    onRequestClose: () => void
    onRequestRemove?: () => void
    onRequestReDownload?: () => void
    onRequestCancel?: () => void
}

const statusMap: Record<AriaStatusString, string[]> = {
    active: ["blue.400", "white", ""],
    waiting: ["orange.400", "white", "等待中"],
    paused: ["orange.400", "white", "已暂停"],
    error: ["red.400", "white", "下载失败"],
    complete: ["bilisound.600", "white", ""],
    removed: ["gray.400", "white", "已取消"],
};

const BOTTOM_COMMON_STYLE = {
    fontSize: "0.875rem",
    opacity: 0.5,
    flexShrink: 0,
    minW: 0,
};

const DownloadManagerItem: React.FC<DownloadManagerItemProps> = ({
    item,
    onRequestClose,
    onRequestRemove,
    onRequestReDownload,
    onRequestCancel,
}) => {
    const bottomButtonOpacity = useColorModeValue(1, 0.6);

    const bottomButtonProps = {
        ...BOTTOM_COMMON_STYLE,
        lineHeight: 1.5,
        variant: "link",
        colorScheme: "bilisound",
        opacity: bottomButtonOpacity,
        flexShrink: 0,
    };

    return (
        <Grid as="li" px={4} py={2} templateColumns="auto 1fr" gap={4} minH="4.5rem">
            <Center
                boxSize={12}
                borderRadius="50%"
                bg="bilisound.600"
                color="white"
                fontSize="1.25rem"
                aria-hidden
            >
                <FontAwesomeIcon icon={faFileAudio} />
            </Center>
            <VStack
                minW={0}
                css={{
                    "> *": {
                        width: "100%",
                    },
                }}
            >
                <HStack>
                    {jsxIf(
                        statusMap[item.status][2],
                        <Text
                            flexShrink={0}
                            bg={statusMap[item.status][0]}
                            color={statusMap[item.status][1]}
                            fontSize="0.75rem"
                            fontWeight="bold"
                            lineHeight="1.5rem"
                            px={2}
                            borderRadius="0.25rem"
                        >
                            {statusMap[item.status][2]}
                        </Text>,
                    )}
                    <Text
                        flexGrow={1}
                        fontWeight="bold"
                        overflow="hidden"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                    >
                        <Link
                            as={RouterLink}
                            to={`/video/${base64url.encode(item.videoId)}`}
                            onClick={() => onRequestClose()}
                        >
                            {item.name || "未知名称"}
                        </Link>
                    </Text>
                </HStack>
                {jsxIf(
                    item.status === "active",
                    <Progress
                        borderRadius="0.125rem"
                        value={(item.fileSizeDone / item.fileSize) * 100}
                        size="xs"
                        colorScheme="bilisound"
                    />,
                )}
                <HStack spacing={4}>
                    {jsxIf(
                        item.status === "active",
                        <>
                            <Text {...BOTTOM_COMMON_STYLE}>{`${toHumanReadableSize(item.speed)}/s`}</Text>
                            <Text {...BOTTOM_COMMON_STYLE}>{`${toHumanReadableSize(item.fileSize)}`}</Text>
                        </>,
                    )}
                    {jsxIf(
                        item.status === "complete", (
                            <Button
                                {...bottomButtonProps}
                                onClick={() => {
                                    const { filePath } = item;
                                    window.electron.ipcRenderer.send("showFile", filePath);
                                }}
                            >
                                在文件夹中显示
                            </Button>
                        ),
                    )}
                    {jsxIf(
                        item.status === "removed" || item.status === "error", (
                            <Button
                                {...bottomButtonProps}
                                onClick={() => onRequestReDownload!()}
                            >
                                重新下载
                            </Button>
                        ),
                    )}
                    <Box flexGrow={1} aria-hidden />
                    {jsxIf(
                        item.status === "active" || item.status === "waiting" || item.status === "paused",
                        <Button
                            {...bottomButtonProps}
                            onClick={() => onRequestCancel!()}
                        >
                            取消下载
                        </Button>,
                    )}
                    {jsxIf(
                        item.status === "complete" || item.status === "removed" || item.status === "error",
                        <Button
                            {...bottomButtonProps}
                            onClick={() => onRequestRemove!()}
                        >
                            删除记录
                        </Button>,
                    )}
                </HStack>
            </VStack>
        </Grid>
    );
};

DownloadManagerItem.defaultProps = {
    onRequestRemove: () => {},
    onRequestReDownload: () => {},
    onRequestCancel: () => {},
};

export default DownloadManagerItem;
