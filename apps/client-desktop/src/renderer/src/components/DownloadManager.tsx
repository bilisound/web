import React, { useEffect, useRef } from "react";
import { useBilisoundStore } from "@/store/bilisoundStore";
import { shallow } from "zustand/shallow";
import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
    Box,
    Button,
    Center,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Text, TextProps, useColorModeValue, useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useConfigStore } from "@/store/configStore";
import { useGetSet } from "react-use";
import sanitize from "sanitize-filename";
import { sliceMap } from "@bilisound2/utils";
import { getAudioStream, getVideoUrl } from "../api/bilibili";
import { AriaClient, AriaClientEvents } from "../utils/rpc-client";
import { BilisoundDownloadItemDisplay, BilisoundDownloadItem } from "../../../common";
import DownloadManagerItem from "./DownloadManagerItem";
import useVirtualList from "../hooks/useVirtualList";

const ipcRenderer = window.electron.ipcRenderer;

const getFallbackObject = (): BilisoundDownloadItem => ({
    gid: "",
    name: "",
    downloadAt: 0,
    doneAt: 0,
    videoId: "",
    videoEpisode: 0,
    filePath: "",
});

const ITEM_HEIGHT = 72;

const DownloadManager: React.FC = () => {
    // 共享状态机
    const {
        detail,
        downloadRequest,
        setDownloadRequest,
        downloadManagerOpen,
        setDownloadManagerOpen,
    } = useBilisoundStore((state) => ({
        detail: state.detail,
        downloadRequest: state.downloadRequest,
        setDownloadRequest: state.setDownloadRequest,
        downloadManagerOpen: state.downloadManagerOpen,
        setDownloadManagerOpen: state.setDownloadManagerOpen,
    }), shallow);

    const toast = useToast();

    const downloadItemBindMap = useRef(new Map<string, BilisoundDownloadItem>());

    const [getDownloadList, setDownloadList] = useGetSet({
        value: [] as BilisoundDownloadItemDisplay[],
    });

    const [getDoneDownloadList, setDoneDownloadList] = useGetSet({
        value: ipcRenderer.sendSync("history.get") as BilisoundDownloadItemDisplay[],
    });

    // ================================================================================
    // Aria2 控制器
    // ================================================================================
    const handleDownloadDone = async (event: keyof AriaClientEvents, gid: string[]) => {
        const client = AriaClient.getInstance();

        for (let i = 0; i < gid.length; i++) {
            const status = await client.tellStatus(gid[i]);
            let filePath = status.files[0].path;
            if (window.electron.process.platform === "win32") {
                filePath = filePath.replaceAll("/", "\\");
            }

            // 通过 gid, 从 downloadItemBindMap 查询下载详情
            const computedStatus: BilisoundDownloadItemDisplay = {
                ...(downloadItemBindMap.current.get(gid[i]) || getFallbackObject()),
                gid: gid[i],
                doneAt: new Date().getTime(),
                fileSize: Number(status.totalLength || 0),
                fileSizeDone: Number(status.completedLength || 0),
                speed: 0,
                status: status.status,
                filePath,
            };

            // 进行归档，显示在下载完成列表
            setDoneDownloadList(({ value }) => {
                value.push(computedStatus);
                ipcRenderer.sendSync("history.set", value);
                return {
                    value,
                };
            });

            // 从当前正在下载的列表删除下载内容
            setDownloadList(({ value }) => {
                const inCurrentIndex = value.findIndex((e) => e.gid === gid[i]);
                if (inCurrentIndex < 0) {
                    return { value };
                }
                value.splice(inCurrentIndex, 1);
                return { value };
            });

            // 清除 downloadItemBindMap 的内容
            downloadItemBindMap.current.delete(gid[i]);

            const description = (
                <Box>
                    <Text mt={1}>{computedStatus.name}</Text>
                    <Button
                        mt={1}
                        colorScheme="white"
                        variant="link"
                        onClick={() => setDownloadManagerOpen(true)}
                    >
                        查看详情
                    </Button>
                </Box>
            );
            if (event === "aria2.onDownloadComplete") {
                toast({
                    status: "success",
                    title: "下载完毕",
                    description,
                    duration: 5000,
                });
            }
            if (event === "aria2.onDownloadError") {
                toast({
                    status: "error",
                    title: "下载失败",
                    description,
                    duration: 5000,
                });
            }
        }
    };

    const handleUpdateListTimer = useRef<any>();

    const handleUpdateList = async () => {
        const client = AriaClient.getInstance();
        const rawList = await client.tellActive();
        setDownloadList({
            value: rawList.map((e) => ({
                ...downloadItemBindMap.current.get(e.gid),
                fileSize: Number(e.totalLength || 0),
                fileSizeDone: Number(e.completedLength || 0),
                speed: Number(e.downloadSpeed || 0),
                status: e.status,
            } as BilisoundDownloadItemDisplay)),
        });
    };

    useEffect(() => {
        const client = AriaClient.getInstance();
        client.on("aria2.onDownloadComplete", handleDownloadDone);
        client.on("aria2.onDownloadStop", handleDownloadDone);
        client.on("aria2.onDownloadError", handleDownloadDone);
        handleUpdateListTimer.current = setInterval(handleUpdateList, 500);
        return () => {
            client.removeListener("aria2.onDownloadComplete", handleDownloadDone);
            client.removeListener("aria2.onDownloadStop", handleDownloadDone);
            client.removeListener("aria2.onDownloadError", handleDownloadDone);
            clearInterval(handleUpdateListTimer.current);
        };
    }, []);

    // ================================================================================
    // 其它
    // ================================================================================
    const {
        getItem,
    } = useConfigStore((state) => ({
        getItem: state.getItem,
    }), shallow);

    // 下载接收
    useEffect(() => {
        if (!downloadRequest.id) {
            return;
        }

        // 首先要知道需要下载什么
        const { id, episode, title } = downloadRequest;
        const description = (
            <Box>
                <Text mt={1}>{title}</Text>
                <Button
                    mt={1}
                    colorScheme="white"
                    variant="link"
                    onClick={() => setDownloadManagerOpen(true)}
                >
                    查看详情
                </Button>
            </Box>
        );

        // 联络 Aria2
        const client = AriaClient.getInstance();
        (async () => {
            const audioUrl = await getAudioStream(id, episode);
            let dir: string = getItem("downloadPath");
            if (window.electron.process.platform === "win32") {
                dir = dir.replaceAll("/", "\\");
            }

            // 获取下载任务的 gid 并绑定上去
            let fileName = `[${getItem("useAv") ? `av${detail?.aid}` : id}] [P${episode}] ${title.replaceAll("/", "∕")}.m4a`;
            fileName = sanitize(fileName);
            let userAgent = navigator.userAgent;
            userAgent = userAgent.replace(/bilisound-desktop-client\/\d+\.\d+\.\d+\s/, "");
            userAgent = userAgent.replace(/Electron\/\d+\.\d+\.\d+\s/, "");
            const gid = await client.addUri(audioUrl, {
                "user-agent": userAgent,
                referer: getVideoUrl(id, episode),
                dir,
                out: fileName,
            });

            setDownloadList((prevState) => {
                const { value } = prevState;
                downloadItemBindMap.current.set(gid, {
                    gid,
                    name: title,
                    downloadAt: new Date().getDate(),
                    doneAt: 0,
                    videoId: id,
                    videoEpisode: episode,
                    filePath: "",
                });
                console.log(downloadItemBindMap.current);
                return {
                    value,
                };
            });
            toast({
                status: "info",
                title: "下载已经开始",
                description,
                duration: 5000,
            });

            setDownloadRequest({
                id: "",
                episode: 0,
                title: "",
            });
        })();
    }, [downloadRequest]);

    // ================================================================================
    // 清空警告
    // ================================================================================
    const {
        isOpen: clearDialogIsOpen,
        onOpen: clearDialogOnOpen,
        onClose: clearDialogOnClose,
    } = useDisclosure();

    const clearDialogCancelRef = useRef<HTMLButtonElement>(null);

    const clearDialog = (
        <AlertDialog
            isOpen={clearDialogIsOpen}
            leastDestructiveRef={clearDialogCancelRef}
            onClose={clearDialogOnClose}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        清空下载列表
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        确定要清空下载列表吗？您已经下载的文件不会被删除。
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={clearDialogCancelRef} onClick={clearDialogOnClose}>
                            取消
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={() => {
                                clearDialogOnClose();
                                setDoneDownloadList(() => {
                                    ipcRenderer.sendSync("history.set", []);
                                    return {
                                        value: [],
                                    };
                                });
                            }}
                            ml={3}
                        >
                            确定
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );

    // ================================================================================
    // 元素
    // ================================================================================
    const barBgColor = useColorModeValue("white", "bilisound.950");

    const barProps: TextProps = {
        px: 4,
        py: 2,
        bg: barBgColor,
        fontSize: "1rem",
        fontWeight: "bold",
        position: "sticky",
        top: 0,
        zIndex: 1,
    };

    const handleRequestClose = () => {
        setDownloadManagerOpen(false);
    };

    const {
        holderRef, holderParentRef, size, begin,
    } = useVirtualList({
        baseItemHeight: ITEM_HEIGHT,
    });

    const renderedList = [...getDoneDownloadList().value].reverse();

    return (
        <div>
            <Drawer
                isOpen={downloadManagerOpen}
                placement="right"
                onClose={() => setDownloadManagerOpen(false)}
            >
                <DrawerOverlay />
                <DrawerContent minW="25rem">
                    <DrawerCloseButton />
                    <DrawerHeader px={4}>下载管理</DrawerHeader>

                    <DrawerBody p={0} ref={holderParentRef}>
                        {(getDownloadList().value.length + getDoneDownloadList().value.length) < 1 ? (
                            <Center h="100%">
                                <Text opacity={0.5}>暂无下载任务</Text>
                            </Center>
                        ) : (
                            <>
                                <Text {...barProps}>{`下载中 (${getDownloadList().value.length})`}</Text>
                                <ul>
                                    {[...getDownloadList().value].reverse().map((e) => (
                                        <DownloadManagerItem
                                            item={e}
                                            key={e.gid}
                                            onRequestClose={handleRequestClose}
                                            onRequestCancel={() => {
                                                AriaClient.getInstance().remove(e.gid);
                                            }}
                                        />
                                    ))}
                                </ul>
                                <Text {...barProps}>{`已完成 (${getDoneDownloadList().value.length})`}</Text>
                                <Box
                                    ref={holderRef}
                                    style={{
                                        height: `${renderedList.length * ITEM_HEIGHT}px`,
                                    } as React.CSSProperties}
                                >
                                    <Box
                                        as="ul"
                                        style={{
                                            transform: `translateY(${begin * ITEM_HEIGHT}px)`,
                                        }}
                                        css={{
                                            display: "block",
                                        }}
                                    >
                                        {sliceMap(renderedList, begin, begin + size, (e, i, arr) => (
                                            <DownloadManagerItem
                                                item={e}
                                                key={e.gid}
                                                onRequestClose={handleRequestClose}
                                                onRequestRemove={() => {
                                                    setDoneDownloadList(({ value }) => {
                                                        value.splice(arr.length - 1 - i, 1);
                                                        ipcRenderer.sendSync("history.set", value);
                                                        return {
                                                            value,
                                                        };
                                                    });
                                                }}
                                                onRequestReDownload={() => {
                                                    setDownloadRequest({
                                                        id: e.videoId,
                                                        episode: e.videoEpisode,
                                                        title: e.name,
                                                    });
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </>
                        )}
                    </DrawerBody>
                    <DrawerFooter px={4}>
                        <Button
                            onClick={clearDialogOnOpen}
                        >
                            清空下载列表
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            {clearDialog}
        </div>
    );
};

export default DownloadManager;
