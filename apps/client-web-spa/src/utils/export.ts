import { AudioQueueData } from "@/utils/audio/types";
import { BILISOUND_DEFAULT_PLAYLIST } from "@/constants/local-storage";
import { saveString } from "@/utils/file";
import { stringify } from "smol-toml";

export interface BilisoundExport {
    kind: "moe.bilisound.app.exportedPlaylist";
    version: 1;
    meta: Meta[];
    detail: Detail[];
}

export interface Meta {
    id: number;
    title: string;
    color: string;
    amount: number;
    imgUrl?: string;
    description: string;
    source?: string;
}

export interface Detail {
    id: number;
    playlistId: number;
    author: string;
    bvid: string;
    duration: number;
    episode: number;
    title: string;
    imgUrl: string;
}

function handleConvert(input: AudioQueueData[]) {
    const exportData: BilisoundExport = {
        detail: [],
        kind: "moe.bilisound.app.exportedPlaylist",
        meta: [],
        version: 1,
    };

    exportData.meta.push({
        amount: input.length,
        color: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
        description: "",
        id: 1,
        title: `导出的播放队列 ${new Date().toLocaleString("zh-hans-CN")}`,
    });
    exportData.detail = input.map((e, i) => ({
        id: i + 1,
        playlistId: 1,
        author: e.author,
        bvid: e.bvid,
        duration: e.duration,
        episode: e.episode,
        title: e.title,
        imgUrl: e.imgUrl,
    }));

    return exportData;
}

export function handleExport() {
    const queue = JSON.parse(globalThis?.localStorage?.[BILISOUND_DEFAULT_PLAYLIST] ?? "[]") as AudioQueueData[];
    const data = handleConvert(queue);
    saveString(data.meta[0].title + ".toml", stringify(data));
}
