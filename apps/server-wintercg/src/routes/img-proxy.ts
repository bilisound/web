import { IRequest } from "itty-router";
import { USER_HEADER } from "@/constants/visit-header";
import CORS_HEADERS from "@/constants/cors";

const HOSTNAME_ALLOWED_SUFFIX = ["hdslb.com", "biliimg.com"];

export async function getImgProxy(request: IRequest) {
    try {
        const url = request.query.url;
        const referrer = request.query.referrer;
        if (!(typeof url === "string" && typeof referrer === "string")) {
            return new Response("", { status: 400 });
        }

        const hostname = new URL(url).hostname;
        let found = false;
        for (let i = 0; i < HOSTNAME_ALLOWED_SUFFIX.length; i++) {
            const e = HOSTNAME_ALLOWED_SUFFIX[i];
            if (hostname.endsWith(e)) {
                found = true;
                break;
            }
        }

        if (!found) {
            return new Response("", { status: 403 });
        }

        const res = await fetch(url, {
            headers: {
                ...USER_HEADER,
                referer: referrer ? "https://www.bilibili.com/video/" + referrer : "https://www.bilibili.com",
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
