import { InitialStateResponse, WebPlayInfo } from "../types";
import { extractJSON } from "../utils/string";
import { USER_HEADER } from "../constants/visit-header";
import { pickRandom } from "../utils/misc";
import { BilisoundPlatformTools } from "../types/interfaces";

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
    const response: string | GetVideoReturns = await fetch(
        `${pickRandom(env.endpoints)}/video/` + id + "/?p=" + episode,
        {
            headers: USER_HEADER,
        },
    ).then(e => {
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
    await cache.put(key, JSON.stringify(obj), 5400); // 90 分钟
    return obj;
}
