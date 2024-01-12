import React, { useEffect, useRef, useState } from "react";
import { useBilisoundStore } from "@/store/bilisoundStore";
import { shallow } from "zustand/shallow";
import type {
    GetBilisoundResourceMetadataResponse,
} from "@/api/online";
import {
    getBilisoundResource,
    getBilisoundResourceMetadata,
} from "@/api/online";
import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
    Box, Button, Text, useDisclosure, useToast,
} from "@chakra-ui/react";
import { useConfigStore } from "@/store/configStore";
import { downloadUrl } from "@/utils/file";
import { secondToTimestamp, toHumanReadableSize } from "@bilisound2/utils";

const DownloadManager: React.FC = () => {
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const cancelRef = useRef<HTMLButtonElement>(null);

    const { isOpen: iOSNoticeIsOpen, onOpen: iOSNoticeOnOpen, onClose: iOSNoticeOnClose } = useDisclosure();

    const iOSNoticeCancelRef = useRef<HTMLButtonElement>(null);

    const {
        getItem,
    } = useConfigStore((state) => ({
        getItem: state.getItem,
    }), shallow);

    const confirmPromise = useRef({
        resolve: (() => {}) as Function,
        reject: (() => {}) as Function,
    });

    const iOSConfirmPromise = useRef({
        resolve: (() => {}) as Function,
        reject: (() => {}) as Function,
    });

    const [downloadMetadata, setDownloadMetadata] = useState<GetBilisoundResourceMetadataResponse>();

    // 内容
    const {
        detail,
        downloadRequest,
        setDownloadListItem,
    } = useBilisoundStore((state) => ({
        detail: state.detail,
        downloadRequest: state.downloadRequest,
        setDownloadListItem: state.setDownloadListItem,
    }), shallow);

    const openDialog = (): Promise<void> => new Promise((resolve, reject) => {
        confirmPromise.current = {
            resolve,
            reject,
        };
        onOpen();

        // 然后，异步获取元数据（openDialog 肯定是在有 detail 的闭包里调用的，所以安全）
        getBilisoundResourceMetadata({ id: detail!.bvid, episode: downloadRequest.value })
            .then((e) => {
                setDownloadMetadata(e.data);
            })
            .catch((e) => {
                throw e;
            })
            .finally(() => {});
    });

    const openIOSDialog = (): Promise<void> => new Promise((resolve, reject) => {
        iOSConfirmPromise.current = {
            resolve,
            reject,
        };
        iOSNoticeOnOpen();
    });

    // 下载接收
    useEffect(() => {
        if (downloadRequest.value <= 0) {
            return;
        }

        const pages = detail?.pages ?? [];
        const target = pages.find((e) => e.page === downloadRequest.value);
        const description = pages.length > 1 ? (
            <Box
                css={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    maxWidth: "60vw",
                }}
            >
                {`${target?.page}. ${target?.part}`}
            </Box>
        ) : undefined;

        openDialog().then(async () => {
            if (navigator.userAgent.includes("iPhone")) {
                await openIOSDialog();
            }
            toast({
                status: "info",
                title: "下载已经开始",
                description,
                duration: 5000,
            });
            setDownloadListItem(downloadRequest.value, { progress: 0, url: "" });
            try {
                const res = await getBilisoundResource({
                    id: detail!.bvid,
                    episode: downloadRequest.value,
                }, ({ percent }, chunk) => {
                    setDownloadListItem(downloadRequest.value, { progress: percent, url: "" });
                });
                toast({
                    status: "success",
                    title: "下载完毕",
                    description,
                    duration: 10000,
                });
                const url = URL.createObjectURL(res);
                setDownloadListItem(downloadRequest.value, { progress: 1, url });
                if (getItem("instantSave")) {
                    downloadUrl(`[${getItem("useAv") ? `av${detail?.aid}` : detail?.bvid}] [P${downloadRequest.value}] ${target?.part}.m4a`, url);
                }
            } catch (e) {
                toast({
                    status: "error",
                    title: "下载音频失败",
                    duration: 20000,
                });
                setDownloadListItem(downloadRequest.value, null);
                throw e;
            }
        }).catch((e) => console.warn("用户取消操作", e));
    }, [downloadRequest]);

    return (
        <div>
            {/* 下载确认 */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => {
                    onClose();
                    confirmPromise.current.reject(new Error("用户点击关闭按钮"));
                }}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent mx={5}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            确定要下载音频吗？
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Text>
                                文件时长：
                                {downloadMetadata
                                    ? <Text as="span" fontWeight="700">{secondToTimestamp(downloadMetadata.duration, { showMillisecond: false })}</Text>
                                    : <Text as="span" opacity={0.5}>查询中...</Text>}
                            </Text>
                            <Text>
                                文件大小：
                                {downloadMetadata
                                    ? <Text as="span" fontWeight="700">{`${toHumanReadableSize(downloadMetadata.fileSize)}`}</Text>
                                    : <Text as="span" opacity={0.5}>查询中...</Text>}
                            </Text>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button
                                ref={cancelRef}
                                onClick={() => {
                                    onClose();
                                    confirmPromise.current.reject(new Error("用户点击取消按钮"));
                                    setDownloadMetadata(undefined);
                                }}
                            >
                                取消
                            </Button>
                            <Button
                                colorScheme="bilisound"
                                onClick={() => {
                                    onClose();
                                    confirmPromise.current.resolve();
                                    setDownloadMetadata(undefined);
                                }}
                                ml={3}
                            >
                                确定
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            {/* iOS 用户提示 */}
            <AlertDialog
                isOpen={iOSNoticeIsOpen}
                leastDestructiveRef={iOSNoticeCancelRef}
                onClose={() => {
                    iOSConfirmPromise.current.resolve();
                    iOSNoticeOnClose();
                }}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent mx={5}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            提示
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Text>由于 iOS 的系统限制，您保存的音频文件不能直接在音乐应用中播放。</Text>
                            <Text>如果需要保存在手机上以便日后播放，我们建议您先将音频文件保存到 iCloud 中，然后通过电脑上的 iTunes 应用下载到手机上，再用音乐应用打开收听。</Text>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button
                                ref={iOSNoticeCancelRef}
                                colorScheme="bilisound"
                                onClick={() => {
                                    iOSConfirmPromise.current.resolve();
                                    iOSNoticeOnClose();
                                }}
                            >
                                确定
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div>
    );
};

export default DownloadManager;
