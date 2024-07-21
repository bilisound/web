import { RouterType } from "itty-router";
import { workerAdapter } from "../utils/adapter";
import {
    getMetadata,
    getResolvedB23,
    getResource,
    getDebugRequest,
    getImgProxy,
    getRaw,
    getResourceMetadata,
    getTransferListId,
    postTransferList,
} from "@bilisound2/server-wintercg";

export default function bilisound(router: RouterType) {
    router.get("/api/internal/resolve-b23", async request => {
        return getResolvedB23(request);
    });

    router.get("/api/internal/metadata", async (request, env) => {
        return getMetadata(request, workerAdapter(env));
    });

    router.get("/api/internal/resource", async (request, env) => {
        return getResource(request, workerAdapter(env));
    });

    router.get("/api/internal/resource-metadata", async (request, env) => {
        return getResourceMetadata(request, workerAdapter(env));
    });

    router.get("/api/internal/img-proxy", async request => {
        return getImgProxy(request);
    });

    router.get("/api/internal/raw", async (request, env) => {
        return getRaw(request, workerAdapter(env));
    });

    router.get("/api/internal/debug-request", async (request, env) => {
        return getDebugRequest(request, workerAdapter(env));
    });

    router.post("/api/internal/transfer-list", async (request, env) => {
        return postTransferList(request, workerAdapter(env));
    });

    router.get("/api/internal/transfer-list/:id", async (request, env) => {
        return getTransferListId(request, workerAdapter(env));
    });
}
