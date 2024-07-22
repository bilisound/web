import CORS_HEADERS from "../constants/cors";

export const ajaxSuccess = (data: unknown) => {
    return new Response(
        JSON.stringify({
            data,
            code: 200,
            msg: "ok",
        }),
        {
            headers: {
                ...CORS_HEADERS,
                "Content-Type": "application/json",
            },
        },
    );
};

export const ajaxError = (msg: unknown, code = 500) => {
    return new Response(
        JSON.stringify({
            code,
            data: null,
            msg: String(msg),
        }),
        {
            status: code,
            headers: {
                ...CORS_HEADERS,
                "Content-Type": "application/json",
            },
        },
    );
};
