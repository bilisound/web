import { KVNamespace } from "@cloudflare/workers-types";
import { InitialStateResponse, WebPlayInfo } from "../types";
import { extractJSON } from "../utils/string";
import { USER_HEADER } from "../constants/visit-header";

const CACHE_PREFIX = "bili_page";

export interface GetVideoOptions {
    cache: KVNamespace;
    env: Record<string, string>;
}

export interface GetVideoReturns {
    initialState: InitialStateResponse,
    playInfo: WebPlayInfo,
}

export async function getVideo(id: string, episode: string | number, { cache, env }: GetVideoOptions): Promise<GetVideoReturns> {
    const key = CACHE_PREFIX + "_" + id + "_" + episode;
    const got = await cache.get(key);
    if (got) {
        return JSON.parse(got);
    }
    const response: string | GetVideoReturns = await fetch(`${env.ENDPOINT_BILI}/video/` + id + "/?p=" + episode, {
        headers: USER_HEADER,
    }).then((e) => {
        if (e.headers.get("content-type") === "application/json") {
            return e.json();
        }
        return e.text();
    });

    // 提取视频播放信息
    let obj: GetVideoReturns;
    if (typeof response === "string") {
        const initialState: InitialStateResponse = extractJSON(/window\.__INITIAL_STATE__={(.+)};/, response);
        const playInfo: WebPlayInfo = extractJSON(/window\.__playinfo__={(.+)}<\/script><script>/, response);
        obj = { initialState, playInfo };
    } else {
        obj = response;
    }
    await cache.put(key, JSON.stringify(obj), { expirationTtl: 5400 }); // 90 分钟
    return obj;
}
