import request from "@/utils/request";
import type { Options } from "ky";
import type { Wrap } from "@/api/common";

export function getBilisoundResolveB23(data: { id: string }) {
    return request
        .get("api/internal/resolve-b23", {
            searchParams: data,
        })
        .json<Wrap<string>>();
}

export type GetBilisoundMetadataResponse = {
    bvid: string;
    aid: number;
    title: string;
    pic: string;
    pubDate: number;
    desc: string;
    owner: {
        mid: number;
        name: string;
        face: string;
    };
    pages: Array<{
        page: number;
        part: string;
        duration: number;
    }>;
};

const infoCache = new Map<string, Wrap<GetBilisoundMetadataResponse>>();

export async function getBilisoundMetadata(data: { id: string }, removeCache = false) {
    const got = infoCache.get(data.id);
    if (got) {
        if (removeCache) {
            infoCache.delete(data.id);
        }
        return got;
    }
    const res = await request
        .get("api/internal/metadata", {
            searchParams: data,
        })
        .json<Wrap<GetBilisoundMetadataResponse>>();
    infoCache.set(data.id, res);
    return res;
}

export function getBilisoundResource(
    data: { id: string; episode: number | string },
    onDownloadProgress: Options["onDownloadProgress"],
) {
    return request
        .get("api/internal/resource", {
            searchParams: data,
            onDownloadProgress,
        })
        .blob();
}

export type GetBilisoundResourceMetadataResponse = {
    duration: number;
    fileSize: number;
};

const metadataCache = new Map<string, GetBilisoundResourceMetadataResponse>();

export async function getBilisoundResourceMetadata(data: { id: string; episode: number | string }) {
    const key = `${data.id}_${data.episode}`;
    const got = metadataCache.get(key);
    if (got) {
        return {
            code: 200,
            msg: "",
            data: got,
        } as Wrap<GetBilisoundResourceMetadataResponse>;
    }
    const res = await request
        .get("api/internal/resource-metadata", {
            searchParams: data,
        })
        .json<Wrap<GetBilisoundResourceMetadataResponse>>();
    metadataCache.set(key, res.data);
    return res;
}
