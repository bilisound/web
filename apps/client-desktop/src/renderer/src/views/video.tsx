import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
    Box, CircularProgress, Modal, ModalContent, ModalOverlay, useToast,
} from "@chakra-ui/react";
import base64url from "base64url";
import { shallow } from "zustand/shallow";
import { getVideo } from "../api/bilibili";
import { useBilisoundStore } from "../store/bilisoundStore";
import { resolveVideo } from "../utils/format";
import Result from "./_index/components/Result";

export async function loader() {
    return null;
}

export const Component: React.FC = () => {
    const params = useParams<"keyword">();

    // Toast
    const toast = useToast();

    // 内容
    const {
        detail,
        setDetail,
        setPlayingEpisode,
        query,
        setQuery,
    } = useBilisoundStore((state) => ({
        detail: state.detail,
        setDetail: state.setDetail,
        setPlayingEpisode: state.setPlayingEpisode,
        query: state.query,
        setQuery: state.setQuery,
    }), shallow);

    // 进度信息
    const [gatheringText, setGatheringText] = useState("");

    useEffect(() => {
        const url = base64url.decode(params.keyword ?? "");
        if (query === url) {
            return;
        }
        setQuery(url);
        (async () => {
            setGatheringText("正在查询视频信息...");
            try {
                const resolved = await resolveVideo(url.trim());
                const metadata = await getVideo(resolved, 1);
                console.log(metadata);
                if (metadata.initialState.videoData.pic.startsWith("http:")) {
                    metadata.initialState.videoData.pic = `https://${metadata.initialState.videoData.pic.slice(7)}`;
                }
                if (metadata.initialState.videoData.owner.face.startsWith("http:")) {
                    metadata.initialState.videoData.owner.face = `https://${metadata.initialState.videoData.owner.face.slice(7)}`;
                }
                setDetail(metadata.initialState);
                setPlayingEpisode(0);
            } catch (e) {
                toast({
                    title: "视频信息查询失败",
                    description: "查询视频信息时发生错误，可能是视频已删除或不存在，或 Bilisound 服务出现问题",
                    status: "error",
                    duration: 10000,
                });
            } finally {
                setGatheringText("");
            }
        })();
    }, [params.keyword]);

    return (
        <Box>
            {detail ? <Result /> : ""}
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
        </Box>
    );
};
