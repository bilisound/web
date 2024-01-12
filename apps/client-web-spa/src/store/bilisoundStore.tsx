import { create } from "zustand";
import { omit } from "lodash-es";
import type { GetBilisoundMetadataResponse } from "@/api/online";
import { APP_TITLE_SUFFIX } from "@/constants";
// import TEST_DATA from "@/assets/test.json";

export interface DownloadListItem {
    progress: number
    url: string
}

export interface BilisoundStoreProps {
    query: string
    detail: GetBilisoundMetadataResponse | null
    downloadRequest: {
        value: number
    }
    downloadList: Record<number, DownloadListItem>
    playingState: boolean
    playingEpisode: number
    scrollRequest: number
}

export interface BilisoundStoreMethods {
    setQuery: (query: string) => void
    setDetail: (detail: GetBilisoundMetadataResponse | null) => void
    setDownloadRequest: (downloadRequest: number) => void
    setDownloadListItem: (episode: number, item?: DownloadListItem | null) => void
    clearDownloadList: () => void
    setPlayingState: (playingState: boolean) => void
    setPlayingEpisode: (playingEpisode: number) => void
    setScrollRequest: (scrollRequest: number) => void
    reset: () => void
}

const defaultProps = (): BilisoundStoreProps => ({
    // 上一次的查询关键词
    query: "",
    // 视频详情
    detail: null,
    // detail: TEST_DATA,
    // 下载请求（分 P）
    downloadRequest: {
        value: 0,
    },
    // 下载状态列表
    downloadList: {},
    // 播放状态
    playingState: false,
    // 当前播放的分 P（0 不显示播放器，-1 暂停，其它值为分 P 编号）
    playingEpisode: 0,
    // 滚动到指定分 P 位置（预留）
    scrollRequest: 0,
});

export const useBilisoundStore = create<BilisoundStoreProps & BilisoundStoreMethods>()((set) => ({
    ...defaultProps(),
    setQuery: (query) => set(() => ({ query })),
    setDetail: (detail) => {
        set(() => ({ detail }));
    },
    setDownloadRequest: (value: number) => set(() => ({ downloadRequest: { value } })),
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
    clearDownloadList: () => {
        set((state) => {
            Object.values(state.downloadList).forEach((e) => {
                if (e.url) {
                    URL.revokeObjectURL(e.url);
                }
            });
            return { downloadList: {} };
        });
    },
    setPlayingState: (playingState) => set(() => ({ playingState })),
    setPlayingEpisode: (playingEpisode) => set(() => ({ playingEpisode })),
    setScrollRequest: (scrollRequest) => set(() => ({ scrollRequest })),
    reset: () => set((state) => {
        Object.values(state.downloadList).forEach((e) => {
            if (e.url) {
                URL.revokeObjectURL(e.url);
            }
        });
        return defaultProps();
    }),
}));
