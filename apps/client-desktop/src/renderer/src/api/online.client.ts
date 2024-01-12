import request from "@/utils/request";
import type { ResponseWrapper } from "@/api/common";
import type { Options } from "ky";

export function getBilisoundResolveB23(data: { id: string }) {
    return request.get("bilisound/resolve-b23", {
        searchParams: data,
    }).json<ResponseWrapper<string>>();
}

export type GetBilisoundMetadataResponse = {
    bvid: string
    aid: number
    title: string
    pic: string
    pubDate: number
    desc: string
    owner: {
        mid: number
        name: string
        face: string
    }
    pages: Array<{
        page: number
        part: string
        duration: number
    }>
};

export function getBilisoundMetadata(data: { id: string }) {
    return request.get("bilisound/metadata", {
        searchParams: data,
    }).json<ResponseWrapper<GetBilisoundMetadataResponse>>();
}

export function getBilisoundResource(data: { id: string, episode: number | string }, onDownloadProgress: Options["onDownloadProgress"]) {
    return request.get("bilisound/resource", {
        searchParams: data,
        onDownloadProgress,
    }).blob();
}

export type GetBilisoundResourceMetadataResponse = {
    duration: number
    fileSize: number
};

const metadataCache = new Map<string, GetBilisoundResourceMetadataResponse>();

export async function getBilisoundResourceMetadata(data: { id: string, episode: number | string }) {
    const key = `${data.id}_${data.episode}`;
    const got = metadataCache.get(key);
    if (got) {
        return {
            code: 200,
            msg: "",
            data: got,
        } as ResponseWrapper<GetBilisoundResourceMetadataResponse>;
    }
    const res = await request.get("bilisound/resource-metadata", {
        searchParams: data,
    }).json<ResponseWrapper<GetBilisoundResourceMetadataResponse>>();
    metadataCache.set(key, res.data);
    return res;
}
