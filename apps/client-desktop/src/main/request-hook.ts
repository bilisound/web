import { BrowserWindow } from "electron";
import caseless from "caseless";

export default function initRequestHook(browserWindow: BrowserWindow) {
    browserWindow.webContents.session.webRequest.onBeforeSendHeaders(
        (details, callback) => {
            let userAgent = details.requestHeaders["User-Agent"] ?? "";
            userAgent = userAgent.replace(/bilisound-desktop-client\/\d+\.\d+\.\d+\s/, "");
            userAgent = userAgent.replace(/Electron\/\d+\.\d+\.\d+\s/, "");

            const requestHeaders = { ...details.requestHeaders };
            const ctx = caseless(requestHeaders);

            ctx.del("Origin");
            ctx.set("User-Agent", userAgent);
            const hostname = new URL(details.url).hostname;
            if (hostname.includes("bilivideo.com")
                || hostname.includes("bilivideo.cn")
                || hostname.includes("akamaized.net")) {
                ctx.set("Referer", "https://www.bilibili.com");
            }

            callback({
                requestHeaders,
            });
        },
    );

    browserWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        const responseHeaders = {
            ...details.responseHeaders,
        };
        const ctx = caseless(responseHeaders);

        ctx.set("Access-Control-Allow-Origin", "*");
        ctx.set("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS");
        ctx.set("Access-Control-Max-Age", "86400");

        callback({
            responseHeaders,
        });
    });
}
