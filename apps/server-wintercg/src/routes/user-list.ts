import { IRequest } from "itty-router";
import { BilisoundPlatformTools } from "@/types/interfaces";
import { getUserSeason, getUserSeries, getUserSeriesMeta } from "@/api/json";
import { ajaxError, ajaxSuccess } from "@/utils/misc";
import { UserSeasonInfo, UserSeriesInfo } from "@/api/types";

export async function getUserList(request: IRequest, env: BilisoundPlatformTools) {
    const { userId, listId, page, mode } = request.query;
    if (
        typeof userId !== "string" ||
        typeof listId !== "string" ||
        typeof page !== "string" ||
        typeof mode !== "string"
    ) {
        return ajaxError("api usage error", 400);
    }
    const cacheKey = `BILI_USER_LIST_${userId}_${listId}_${page}_${mode}`;
    const got = await env.cache.get(cacheKey);
    if (got) {
        return ajaxSuccess(JSON.parse(got));
    }
    let response: UserSeriesInfo | UserSeasonInfo;
    let pageSize = 0;
    let pageNum = 0;
    let total = 0;
    let name = "";
    let description = "";
    let cover = "";
    if (mode === "season") {
        response = await getUserSeason(userId, listId, Number(page));
        const data = response.data;
        pageSize = data.page.page_size;
        pageNum = data.page.page_num;
        total = data.page.total;
        name = data.meta.name;
        description = data.meta.description;
        cover = data.meta.cover;
    } else {
        response = await getUserSeries(userId, listId, Number(page));
        const meta = await getUserSeriesMeta(listId);
        pageSize = response.data.page.size;
        pageNum = response.data.page.num;
        total = response.data.page.total;
        name = meta.data.meta.name;
        description = meta.data.meta.description;
        cover = response.data.archives[0].pic;
    }
    const rows = response.data.archives.map(e => ({
        bvid: e.bvid,
        title: e.title,
        cover: e.pic,
        duration: e.duration,
    }));
    const data = {
        pageSize,
        pageNum,
        total,
        rows,
        meta: {
            name,
            description,
            cover,
            userId,
            seasonId: listId,
        },
    };
    await env.cache.put(cacheKey, JSON.stringify(data), 3600);
    return ajaxSuccess(data);
}
