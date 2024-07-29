import { IRequest } from "itty-router";
import { USER_HEADER } from "@/constants/visit-header";
import CORS_HEADERS from "@/constants/cors";

export async function getImgProxy(request: IRequest) {
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
}
