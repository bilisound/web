import { IRequest } from "itty-router";
import { BilisoundPlatformTools } from "../types/interfaces";
import { USER_HEADER } from "../constants/visit-header";
import { ajaxError, ajaxSuccess } from "../utils/misc";
import { pickRandom } from "../utils/data";

export async function getDebugRequest(request: IRequest, { env }: BilisoundPlatformTools) {
    const url = request.query.url as string;
    const password = request.query.password;
    if (password !== env.debugKey) {
        return new Response("404, not found!", { status: 404 });
    }
    try {
        const endpoint = pickRandom(env.endpoints);
        const headers = { ...USER_HEADER };
        if (endpoint.key) {
            headers["Bilisound-Token"] = endpoint.key;
        }
        const response = await fetch(url ?? endpoint.url, {
            headers,
        }).then(e => {
            return e.text();
        });
        return ajaxSuccess({ response, headers, env });
    } catch (e) {
        return ajaxError(e);
    }
}
