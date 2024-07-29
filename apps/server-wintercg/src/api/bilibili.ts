import { InitialStateResponse, WebPlayInfo } from "@/api/types";
import { extractJSON } from "@/utils/string";
import { USER_HEADER } from "@/constants/visit-header";
import { BilisoundPlatformTools } from "@/types/interfaces";
import { pickRandom } from "@/utils/data";
import { Numberish } from "@/types/common";

const CACHE_PREFIX = "bili_page";

export interface GetVideoReturns {
    initialState: InitialStateResponse;
    playInfo: WebPlayInfo;
}

export async function getVideo(
    id: string,
    episode: string | number,
    { cache, env }: BilisoundPlatformTools,
): Promise<GetVideoReturns> {
    const key = CACHE_PREFIX + "_" + id + "_" + episode;
    const got = await cache.get(key);
    if (got) {
        return JSON.parse(got);
    }
    const endpoint = pickRandom(env.endpoints);
    const headers = { ...USER_HEADER };
    if (endpoint.key) {
        headers["Bilisound-Token"] = endpoint.key;
    }
    const response = await fetch(`${endpoint.url}/video/` + id + "/?p=" + episode, {
        headers,
    });
    const data = await response.text();

    // 提取视频播放信息
    const initialState: InitialStateResponse = extractJSON(/window\.__INITIAL_STATE__={(.+)};/, data);
    const playInfo: WebPlayInfo = extractJSON(/window\.__playinfo__={(.+)}<\/script><script>/, data);
    const obj: GetVideoReturns = { initialState, playInfo };
    await cache.put(key, JSON.stringify(obj), 5400); // 90 分钟
    return obj;
}

export interface EpisodeItem {
    bvid: string;
    title: string;
    cover: string;
    duration: number;
}

export interface GetEpisodeUserResponse {
    pageSize: number;
    pageNum: number;
    total: number;
    rows: EpisodeItem[];
    meta: {
        name: string;
        description: string;
        cover: string;
        userId: Numberish;
        seasonId: Numberish;
    };
}

export type UserListMode = "episode" | "series";
