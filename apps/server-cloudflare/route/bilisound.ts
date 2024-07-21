import { RouterType } from "itty-router";
import { AjaxError, AjaxSuccess, fineBestAudio, pickRandom } from "../utils/misc";
import CORS_HEADERS from "../constants/cors";
import { KVNamespace } from "@cloudflare/workers-types";
import { getVideo } from "../api/bilibili";
import { v4 } from "uuid";
import { USER_HEADER } from "../constants/visit-header";
import { getMetadata, getResolvedB23, getResource } from "@bilisound2/server-wintercg";
import { workerAdapter } from "../utils/adapter";

export default function bilisound(router: RouterType) {
    router.get("/api/internal/resolve-b23", async request => {
        return getResolvedB23(request);
    });

    router.get("/api/internal/metadata", async (request, env) => {
        return getMetadata(request, workerAdapter(env));
    });

    router.get("/api/internal/resource", async (request, env) => {
        return getResource(request, workerAdapter(env));
    });

    router.get("/api/internal/resource-metadata", async (request, env) => {
        const cache = env.bilisound as KVNamespace;
        const id = request.query.id;
        const episode = Number(request.query.episode);
        if (typeof id !== "string" || !Number.isInteger(episode) || episode < 1) {
            return AjaxError("api usage error", 400);
        }

        try {
            // 获取视频
            const { playInfo, initialState } = await getVideo(id, episode, { cache, env });
            const dashAudio = playInfo?.data?.dash?.audio ?? [];

            if (dashAudio.length < 1) {
                return AjaxError("no dash data found");
            }

            // 遍历获取最佳音质视频
            const maxQualityIndex = fineBestAudio(dashAudio);

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

            return AjaxSuccess({
                duration: pageItem?.duration ?? 0,
                fileSize: Number(res.headers.get("Content-Length") ?? 0),
            });
        } catch (e) {
            return AjaxError(e);
        }
    });

    router.get("/api/internal/img-proxy", async request => {
        try {
            const url = request.query.url;
            const referrer = request.query.referrer;
            if (!(typeof url === "string" && typeof referrer === "string")) {
                return new Response("", { status: 400 });
            }

            if (!new URL(url).hostname.endsWith("hdslb.com")) {
                return new Response("", { status: 403 });
            }

            const res = await fetch(url, {
                headers: {
                    ...USER_HEADER,
                    referer: "https://www.bilibili.com/video/" + referrer,
                },
            });

            return new Response(await res.arrayBuffer(), {
                headers: {
                    ...CORS_HEADERS,
                    "Cache-Control": "max-age=604800",
                    "Content-Type": res.headers.get("Content-Type"),
                },
            });
        } catch (e) {
            console.error(e);
            return new Response("", { status: 500 });
        }
    });

    router.get("/api/internal/raw", async (request, env) => {
        const cache = env.bilisound as KVNamespace;
        const id = request.query.id;
        if (typeof id !== "string") {
            return AjaxError("api usage error", 400);
        }

        try {
            // 获取视频网页
            const response = await getVideo(id, 1, { cache, env });
            return AjaxSuccess(response);
        } catch (e) {
            return AjaxError(e);
        }
    });

    router.get("/api/internal/debug-request", async (request, env) => {
        const url = request.query.url as string;
        const password = request.query.password;
        if (password !== env.DEBUG_KEY) {
            return new Response("404, not found!", { status: 404 });
        }
        try {
            const headers = USER_HEADER;
            const response = await fetch(url ?? pickRandom(env.ENDPOINT_BILI), {
                headers,
            }).then(e => {
                return e.text();
            });
            return AjaxSuccess({ response, headers, env });
        } catch (e) {
            return AjaxError(e);
        }
    });

    router.post("/api/internal/transfer-list", async (request, env) => {
        const cache = env.bilisound as KVNamespace;
        const keySuffix = v4();
        try {
            // 请求预检
            if (request.headers.get("content-type") !== "application/json") {
                return AjaxError("Unsupported data type", 400);
            }

            // 读取用户传输的数据
            const userInput = await request.json();
            if (!Array.isArray(userInput)) {
                return AjaxError("Unsupported data type", 400);
            }

            await cache.put(
                `transfer_list_${keySuffix}`,
                JSON.stringify(userInput, (key, value) => {
                    if (key === "key" || key === "url") {
                        return undefined;
                    }
                    return value;
                }),
                { expirationTtl: 330 },
            ); // 5 分钟 30 秒
            return AjaxSuccess(keySuffix);
        } catch (e) {
            return AjaxError(e);
        }
    });

    router.get("/api/internal/transfer-list/:id", async (request, env) => {
        const cache = env.bilisound as KVNamespace;
        const { params } = request;
        const keySuffix = params.id;

        const got = await cache.get(`transfer_list_${keySuffix}`);

        return AjaxSuccess(JSON.parse(got));
    });
}
