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

export async function getBilisoundMetadata(data: { id: string }) {
    const res = await request
        .get("api/internal/metadata", {
            searchParams: data,
        })
        .json<Wrap<GetBilisoundMetadataResponse>>();

    // 只有一个选集时，将该选集的名称更改为与视频标题相同的名称
    if (res.data.pages.length === 1) {
        res.data.pages[0].part = res.data.title;
    }
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

export async function postInternalTransferList(data: any) {
    const res = await request
        .post("api/internal/transfer-list", {
            json: data,
        })
        .json<Wrap<string>>();
    return res;
}
