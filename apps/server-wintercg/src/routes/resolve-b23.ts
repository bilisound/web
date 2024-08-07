import { ajaxError, ajaxSuccess } from "../utils/misc";
import { USER_HEADER } from "../constants/visit-header";
import { IRequest } from "itty-router";

export async function getResolvedB23(request: IRequest) {
    const id = request.query.id;
    if (typeof id !== "string") {
        return ajaxError("api usage error", 400);
    }

    try {
        const response = await fetch("https://b23.tv/" + id, {
            headers: USER_HEADER,
            redirect: "manual",
        });

        const target = response.headers.get("location");
        if (!target) {
            return ajaxError("bad location", 404);
        }

        return ajaxSuccess(response.headers.get("location"));
    } catch (e) {
        return ajaxError(e);
    }
}
