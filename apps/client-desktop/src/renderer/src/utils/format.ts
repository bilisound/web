import { getBilisoundResolveB23 } from "@/api/online.client";

export const B23_REGEX = /(https?:\/\/b23\.tv\/[a-zA-Z0-9]+)/;

/**
 * 解析用户输入的视频内容。传入的字符串需要先行 trim 处理
 *
 * 支持的格式：
 *
 * - `188136`
 * - `av188136`
 * - `BV1Gx411w7wU`
 * - `https://www.bilibili.com/video/BV1Gx411w7wU`
 * - `https://m.bilibili.com/video/BV1Gx411w7wU`
 * - `https://b23.tv/k37TjOT`（需要调接口解析）
 * @param input
 */
export async function resolveVideo(input: string): Promise<string> {
    // 纯数字
    if (/^\d+$/.test(input)) {
        return `av${input}`;
    }

    // av 号、BV 号
    if (/^BV.+$/.test(input) || /^av\d+$/.test(input)) {
        return input;
    }

    // 含有 b23.tv 的短链接
    const tested = B23_REGEX.exec(input);
    if (tested && tested[1]) {
        const response = await getBilisoundResolveB23({
            id: new URL(tested[1]).pathname.split("/")[1],
        });
        return resolveVideo(response.data);
    }

    // 可能是链接
    const url = new URL(input);

    // 普通视频链接
    if (url.hostname.endsWith("bilibili.com")) {
        const id = url.pathname.split("/")[2];
        if (!id) {
            throw new Error("no param found");
        }
        if (!(id.startsWith("BV") || id.startsWith("av"))) {
            throw new Error("param is not av or bv");
        }
        return id;
    }

    // b23.tv 短链接
    if (url.hostname === "b23.tv") {
        const response = await getBilisoundResolveB23({
            id: url.pathname.split("/")[1],
        });
        return resolveVideo(response.data);
    }

    throw new Error("unsupported source");
}
