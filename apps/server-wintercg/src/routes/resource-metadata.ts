import { ajaxError, ajaxSuccess } from "../utils/misc";
import { getVideo } from "../api/bilibili";
import { USER_HEADER } from "../constants/visit-header";
import { IRequest } from "itty-router";
import { BilisoundPlatformTools } from "../types/interfaces";
import { findBestAudio } from "../utils/data";

export async function getResourceMetadata(request: IRequest, env: BilisoundPlatformTools) {
    const id = request.query.id;
    const episode = Number(request.query.episode);
    if (typeof id !== "string" || !Number.isInteger(episode) || episode < 1) {
        return ajaxError("api usage error", 400);
    }

    try {
        // 获取视频
        const { playInfo, initialState } = await getVideo(id, episode, env);
        const dashAudio = playInfo?.data?.dash?.audio ?? [];

        if (dashAudio.length < 1) {
            return ajaxError("no dash data found");
        }

        // 遍历获取最佳音质视频
        const maxQualityIndex = findBestAudio(dashAudio);

        const item = dashAudio[maxQualityIndex];
        const res = await fetch(item.baseUrl, {
            method: "head",
            headers: {
                ...USER_HEADER,
                referer: `https://www.bilibili.com/video/` + id + "/?p=" + episode,
            },
        });

        // 查询文件大小
        const pageItem = initialState.videoData.pages.find(e => e.page === episode);

        return ajaxSuccess({
            duration: pageItem?.duration ?? 0,
            fileSize: Number(res.headers.get("Content-Length") ?? 0),
        });
    } catch (e) {
        return ajaxError(e);
    }
}
