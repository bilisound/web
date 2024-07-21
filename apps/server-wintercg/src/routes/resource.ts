import { IRequest } from "itty-router";
import { BilisoundPlatformTools } from "../types/interfaces";
import { ajaxError } from "../utils/misc";
import { getVideo } from "../api/bilibili";
import { USER_HEADER } from "../constants/visit-header";
import CORS_HEADERS from "../constants/cors";
import { findBestAudio } from "../utils/data";

export async function getResource(request: IRequest, env: BilisoundPlatformTools) {
    const id = request.query.id;
    const episode = Number(request.query.episode);
    const dl = request.query.dl;
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

        // 将音频字节流进行转发
        const range = request.headers.get("Range");
        const headers = {
            ...USER_HEADER,
            referer: `https://www.bilibili.com/video/` + id + "/?p=" + episode,
            Range: range || "bytes=0-",
        };
        const res = await fetch(dashAudio[maxQualityIndex].baseUrl, {
            headers,
        });

        let episodeName = initialState.videoData.title;
        if (initialState.videoData.pages.length > 1) {
            episodeName = initialState.videoData.pages.find(e => e.page === episode)?.part;
        }
        const fileName = `[${dl === "av" ? `av${initialState.aid}` : initialState.bvid}] [P${episode}] ${episodeName}.m4a`;
        const buf = await res.arrayBuffer();

        return new Response(buf, {
            status: range ? 206 : 200,
            headers: {
                ...CORS_HEADERS,
                ...(dl
                    ? {
                          "Content-Disposition": `filename*=utf-8''${encodeURIComponent(fileName)}`,
                      }
                    : {}),
                "Content-Type": dl ? "application/octet-stream" : "audio/mp4",
                "Accept-Ranges": "bytes",
                "Cache-Control": "max-age=604800",
                ...(range
                    ? {
                          "Content-Range": res.headers.get("Content-Range"),
                          "Content-Length": res.headers.get("Content-Length"),
                      }
                    : {}),
            },
        });
    } catch (e) {
        return ajaxError(e);
    }
}
