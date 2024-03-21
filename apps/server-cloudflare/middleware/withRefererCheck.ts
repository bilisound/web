import { IRequest } from "itty-router";
import { AjaxError } from "../utils/misc";

const whitelist = [/^https:\/\/(?:[\w-]+\.)*bilisound\.moe(?:\/[\w\/.-]*)?$/]

const withRefererCheck = (request: IRequest) => {
    const refererValue = request.headers.get("referer");
    if (refererValue && !whitelist.find((e) => e.test(refererValue))) {
        return AjaxError("forbidden", 403);
    }
}

export default withRefererCheck;
