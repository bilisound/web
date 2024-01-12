import React, { useEffect, useState } from "react";
import { useParams } from "umi";
import {
    Box, CircularProgress, Modal, ModalContent, ModalOverlay, useToast,
} from "@chakra-ui/react";
import { resolveVideo } from "@/utils/format";
import { getBilisoundMetadata } from "@/api/online";
import { useBilisoundStore } from "@/store/bilisoundStore";
import { shallow } from "zustand/shallow";
import base64url from "base64url";
import Wrapper from "@/components/Wrapper";
import { APP_TITLE_SUFFIX } from "@/constants";
import PartList from "./components/PartList";
import SubmissionDetail from "./components/SubmissionDetail";

const Component: React.FC = () => {
    const params = useParams<"queryEncoded">();

    const toast = useToast();

    // 内容
    const {
        detail,
        setDetail,
        setPlayingEpisode,
        query,
        setQuery,
        clearDownloadList,
    } = useBilisoundStore((state) => ({
        detail: state.detail,
        setDetail: state.setDetail,
        setPlayingEpisode: state.setPlayingEpisode,
        query: state.query,
        setQuery: state.setQuery,
        clearDownloadList: state.clearDownloadList,
    }), shallow);

    const [gatheringText, setGatheringText] = useState("");

    useEffect(() => {
        (async () => {
            const url = base64url.decode(params.queryEncoded ?? "");
            if (url === query) {
                return;
            }
            setQuery(url);

            setGatheringText("正在查询视频信息...");
            const resolved = await resolveVideo(url.trim());
            const metadata = await getBilisoundMetadata({
                id: resolved,
            });
            if (metadata.data.pic.startsWith("http:")) {
                metadata.data.pic = `https://${metadata.data.pic.slice(7)}`;
            }
            if (metadata.data.owner.face.startsWith("http:")) {
                metadata.data.owner.face = `https://${metadata.data.owner.face.slice(7)}`;
            }
            if (metadata.data.pages.length === 1) {
                metadata.data.pages[0].part = metadata.data.title;
            }
            setDetail(metadata.data);
            document.title = `${metadata.data.title} - 视频详情${APP_TITLE_SUFFIX}`;
            clearDownloadList();
            setPlayingEpisode(0);
        })().catch((e) => {
            toast({
                title: "视频信息查询失败",
                description: "查询视频信息时发生错误，可能是视频已删除或不存在，或 Bilisound 服务出现问题",
                status: "error",
                duration: 10000,
            });
            throw e;
        }).finally(() => {
            setGatheringText("");
        });
    }, [params.queryEncoded]);

    useEffect(() => {
        if (detail) {
            document.title = `${detail.title} - 视频详情${APP_TITLE_SUFFIX}`;
        } else {
            document.title = `视频查询${APP_TITLE_SUFFIX}`;
        }
    }, []);

    // 模态
    const gatheringModel = (
        <Modal onClose={() => {}} isOpen={!!gatheringText} isCentered>
            <ModalOverlay background="blackAlpha.700" />
            <ModalContent
                mx={5}
            >
                <Box
                    p={4}
                    css={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress
                        isIndeterminate
                        color="bilisound.600"
                        css={{
                            flexShrink: 0,
                        }}
                    />
                    <Box ms={4}>
                        {gatheringText}
                    </Box>
                </Box>
            </ModalContent>
        </Modal>
    );

    return (
        <Box>
            {gatheringModel}
            {detail ? (
                <Wrapper>
                    <main>
                        <SubmissionDetail detail={detail!} />
                        <PartList list={detail?.pages ?? []} />
                    </main>
                </Wrapper>
            ) : null}
        </Box>
    );
};

export default Component;
