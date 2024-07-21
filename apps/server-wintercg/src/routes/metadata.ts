import { ajaxError, ajaxSuccess } from "../utils/misc";
import { getVideo } from "../api/bilibili";
import { IRequest } from "itty-router";
import { BilisoundPlatformTools } from "../types/interfaces";

export async function getMetadata(request: IRequest, { env, cache }: BilisoundPlatformTools) {
    const id = request.query.id;
    if (typeof id !== "string") {
        return ajaxError("api usage error", 400);
    }

    try {
        // 获取视频网页
        const { initialState } = await getVideo(id, 1, { cache, env });

        // 提取视频信息
        const videoData = initialState?.videoData;
        const pages = videoData?.pages ?? [];
        if (pages.length <= 0) {
            return ajaxError("no video found", 404);
        }

        return ajaxSuccess({
            bvid: videoData.bvid,
            aid: videoData.aid,
            title: videoData.title,
            pic: videoData.pic,
            owner: videoData.owner,
            desc: videoData.desc,
            pubDate: videoData.pubdate * 1000,
            pages: pages.map(({ page, part, duration }) => ({ page, part, duration })),
        });
    } catch (e) {
        console.log(e);
        return ajaxError(e);
    }
}
