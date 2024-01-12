import { create } from "zustand";
import { omit } from "lodash-es";
import { InitialState } from "../types";
// import TEST_DATA from "@/assets/test.json";

export interface DownloadListItem {
    progress: number
    url: string
}

export interface BilisoundStoreProps {
    query: string
    detail: InitialState | null
    downloadRequest: {
        id: string
        episode: number
        title: string
    }
    downloadList: Record<number, DownloadListItem>
    playingState: boolean
    playingEpisode: number
    scrollRequest: number
    downloadManagerOpen: boolean
}

export interface BilisoundStoreMethods {
    setQuery: (query: string) => void
    setDetail: (detail: InitialState | null) => void
    setDownloadRequest: (downloadRequest: BilisoundStoreProps["downloadRequest"]) => void
    setDownloadListItem: (episode: number, item?: DownloadListItem | null) => void
    setPlayingState: (playingState: boolean) => void
    setPlayingEpisode: (playingEpisode: number) => void
    setScrollRequest: (scrollRequest: number) => void
    setDownloadManagerOpen: (downloadManagerOpen: boolean) => void
    reset: () => void
}

const defaultProps = (): BilisoundStoreProps => ({
    // 查询关键词
    query: "",
    // 视频详情
    detail: null, // TEST_DATA
    // 下载请求（分 P）
    downloadRequest: {
        id: "",
        episode: -1,
        title: "",
    },
    // 下载状态列表
    downloadList: {},
    // 播放状态
    playingState: false,
    // 当前播放的分 P（0 不显示播放器，-1 暂停，其它值为分 P 编号）
    playingEpisode: 0,
    // 滚动到指定分 P 位置（预留）
    scrollRequest: 0,
    // 下载管理开启状态
    downloadManagerOpen: false,
});

export const useBilisoundStore = create<BilisoundStoreProps & BilisoundStoreMethods>()((set) => ({
    ...defaultProps(),
    setQuery: (query) => set(() => ({ query })),
    setDetail: (detail) => set(() => ({
        detail,
        // 下载状态列表
        downloadList: {},
        // 播放状态
        playingState: false,
        // 当前播放的分 P（0 不显示播放器，-1 暂停，其它值为分 P 编号）
        playingEpisode: 0,
    })),
    setDownloadRequest: (downloadRequest) => set(() => ({ downloadRequest })),
    setDownloadListItem: (episode: number, item?: DownloadListItem | null) => set((state) => {
        if (!item) {
            return {
                downloadList: omit(state.downloadList, String(episode)),
            };
        }
        return {
            downloadList: {
                ...state.downloadList,
                [episode]: item,
            },
        };
    }),
    setPlayingState: (playingState) => set(() => ({ playingState })),
    setPlayingEpisode: (playingEpisode) => set(() => ({ playingEpisode })),
    setScrollRequest: (scrollRequest) => set(() => ({ scrollRequest })),
    setDownloadManagerOpen: (downloadManagerOpen) => set(() => ({ downloadManagerOpen })),
    reset: () => set((state) => {
        Object.values(state.downloadList).forEach((e) => {
            if (e.url) {
                URL.revokeObjectURL(e.url);
            }
        });
        return defaultProps();
    }),
}));
