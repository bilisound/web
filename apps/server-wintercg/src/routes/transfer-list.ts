import { v4 } from "uuid";
import { ajaxError, ajaxSuccess } from "../utils/misc";
import { IRequest } from "itty-router";
import { BilisoundPlatformTools } from "../types/interfaces";

export async function postTransferList(request: IRequest, env: BilisoundPlatformTools) {
    const cache = env.cache;
    const keySuffix = v4();
    try {
        // 请求预检
        if (request.headers.get("content-type") !== "application/json") {
            return ajaxError("Unsupported data type", 400);
        }

        // 读取用户传输的数据
        const userInput = await request.json();
        if (!Array.isArray(userInput)) {
            return ajaxError("Unsupported data type", 400);
        }

        await cache.put(
            `transfer_list_${keySuffix}`,
            JSON.stringify(userInput, (key, value) => {
                if (key === "key" || key === "url") {
                    return undefined;
                }
                return value;
            }),
            330,
        ); // 5 分钟 30 秒
        return ajaxSuccess(keySuffix);
    } catch (e) {
        return ajaxError(e);
    }
}

export async function getTransferListId(request: IRequest, env: BilisoundPlatformTools) {
    const cache = env.cache;
    const { params } = request;
    const keySuffix = params.id;

    const got = await cache.get(`transfer_list_${keySuffix}`);

    return ajaxSuccess(JSON.parse(got));
}
