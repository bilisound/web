import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ConfigStoreProps {
    // 静音
    muted: boolean;
    // 添加到播放列表后自动播放音频
    autoPlay: boolean;
    // 添加到播放列表后自动下载音频
    instantSave: boolean;
    // 保存音频时使用 av 号
    useAv: boolean;
    // 显示看板娘
    showYuruChara: boolean;
    // 显示播放器
    showPlayer: boolean;
    // 点击「查看源视频」后暂停音频
    pauseWhenOpenExternal: boolean;
}

export interface ConfigStoreMethods {
    setMuted: (muted: boolean) => void;
    setAutoPlay: (autoPlay: boolean) => void;
    setInstantSave: (instantSave: boolean) => void;
    setUseAv: (useAv: boolean) => void;
    setShowYuruChara: (showYuruChara: boolean) => void;
    setShowPlayer: (showPlayer: boolean) => void;
    setPauseWhenOpenExternal: (pauseWhenOpenExternal: boolean) => void;
}

export const useConfigStore = create<ConfigStoreProps & ConfigStoreMethods>()(
    persist(
        set => ({
            muted: false,
            setMuted: muted => set(() => ({ muted })),
            autoPlay: true,
            setAutoPlay: autoPlay => set(() => ({ autoPlay })),
            instantSave: false,
            setInstantSave: instantSave => set(() => ({ instantSave })),
            useAv: false,
            setUseAv: useAv => set(() => ({ useAv })),
            showYuruChara: true,
            setShowYuruChara: showYuruChara => set(() => ({ showYuruChara })),
            showPlayer: true,
            setShowPlayer: showPlayer => set(() => ({ showPlayer })),
            pauseWhenOpenExternal: true,
            setPauseWhenOpenExternal: pauseWhenOpenExternal => set(() => ({ pauseWhenOpenExternal })),
        }),
        {
            name: "bilisound-config", // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => window.localStorage), // (optional) by default, 'localStorage' is used
        },
    ),
);
