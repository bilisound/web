import { ajaxError, ajaxSuccess } from "../utils/misc";
import { getVideo } from "../api/bilibili";
import { IRequest } from "itty-router";
import { BilisoundPlatformTools } from "../types/interfaces";

export async function getRaw(request: IRequest, env: BilisoundPlatformTools) {
    const id = request.query.id;
    if (typeof id !== "string") {
        return ajaxError("api usage error", 400);
    }

    try {
        // 获取视频网页
        const response = await getVideo(id, 1, env);
        return ajaxSuccess(response);
    } catch (e) {
        return ajaxError(e);
    }
}
