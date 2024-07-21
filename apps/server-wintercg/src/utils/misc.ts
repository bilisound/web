import { merge } from "lodash-es";
import CORS_HEADERS from "../constants/cors";
import { WebPlayInfo } from "../types";

export const ajaxSuccess = (data: unknown, options: RequestInit = {}) => {
    return new Response(
        JSON.stringify({
            data,
            code: 200,
            msg: "ok",
        }),
        merge(
            {
                headers: {
                    ...CORS_HEADERS,
                    "Content-Type": "application/json",
                },
            } as ResponseInit,
            options,
        ),
    );
};

export const ajaxError = (msg: unknown, code = 500, options: RequestInit = {}) => {
    return new Response(
        JSON.stringify({
            code,
            data: null,
            msg: String(msg),
        }),
        merge(
            {
                status: code,
                headers: {
                    ...CORS_HEADERS,
                    "Content-Type": "application/json",
                },
            } as ResponseInit,
            options,
        ),
    );
};
