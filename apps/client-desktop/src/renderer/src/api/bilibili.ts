import { InitialState, PlayInfo } from "../types";
import { extractJSON } from "../utils/string";

interface PageCacheInfo {
    data: any
    time: number
}

const pageCache = new Map<string, PageCacheInfo>();

export function getVideoUrl(id: string, episode: string | number) {
    return `https://www.bilibili.com/video/${id}/?p=${episode}`;
}

export async function getVideo(id: string, episode: string | number): Promise<{
    initialState: InitialState,
    playInfo: PlayInfo,
}> {
    const key = `${id}_${episode}`;
    const got = pageCache.get(key);
    if (got && got.time + (5 * 60 * 1000) < new Date().getTime()) {
        return got.data;
    }
    const response = await fetch(getVideoUrl(id, episode), {
    }).then((e) => e.text());

    // 提取视频播放信息
    const initialState: InitialState = extractJSON(/window\.__INITIAL_STATE__={(.+)};/, response);
    const playInfo: PlayInfo = extractJSON(/window\.__playinfo__={(.+)}<\/script><script>/, response);

    if (initialState.videoData.pages.length === 1) {
        initialState.videoData.pages[0].part = initialState.videoData.title;
    }

    const obj = { initialState, playInfo };
    await pageCache.set(key, {
        time: new Date().getTime(),
        data: obj,
    });
    return obj;
}

export async function getAudioStream(id: string, episode: string | number) {
    const { playInfo } = await getVideo(id, episode);
    const dashAudio = playInfo?.data?.dash?.audio ?? [];

    if (!dashAudio) {
        throw new Error("no dash data found");
    }

    // 遍历获取最佳音质视频
    let maxQualityIndex = 0;
    dashAudio.forEach((value, index, array) => {
        if (array[maxQualityIndex].codecid < maxQualityIndex) {
            maxQualityIndex = index;
        }
    });

    const item = dashAudio[maxQualityIndex];

    console.log("获取音频链接", item.baseUrl);
    return item.baseUrl;
}
