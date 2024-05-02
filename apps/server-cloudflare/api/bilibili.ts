import { KVNamespace } from "@cloudflare/workers-types";
import { InitialStateResponse, WebPlayInfo } from "../types";
import { extractJSON } from "../utils/string";

const CACHE_PREFIX = "bili_page";

export const USER_HEADER = {};

export interface GetVideoOptions {
    cache: KVNamespace;
    env: Record<string, string>;
}

export async function getVideo(id: string, episode: string | number, { cache, env }: GetVideoOptions): Promise<{
    initialState: InitialStateResponse,
    playInfo: WebPlayInfo,
}> {
    const key = CACHE_PREFIX + "_" + id + "_" + episode;
    const got = await cache.get(key);
    // console.log("缓存内容", got);
    if (got) {
        // console.log("缓存命中");
        return JSON.parse(got);
    }
    // console.log("缓存没有命中");
    const response = await fetch(`${env.ENDPOINT_BILI}/video/` + id + "/?p=" + episode, {
        headers: USER_HEADER,
    }).then((e) => {
        return e.text();
    });

    // 提取视频播放信息
    const initialState: InitialStateResponse = extractJSON(/window\.__INITIAL_STATE__={(.+)};/, response);
    const playInfo: WebPlayInfo = extractJSON(/window\.__playinfo__={(.+)}<\/script><script>/, response);
    const obj = { initialState, playInfo };
    await cache.put(key, JSON.stringify(obj), { expirationTtl: 5400 }); // 90 分钟
    return obj;
}
