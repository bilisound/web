export const B23_REGEX = /(https?:\/\/b23\.tv\/[a-zA-Z0-9]+)/;

export function validateUserQuery(value: string) {
    value = value.trim();
    if (/^BV.+$/.test(value) || /^av\d+$/.test(value) || /^\d+$/.test(value)) {
        return true;
    }

    if (B23_REGEX.test(value)) {
        return true;
    }

    try {
        const url = new URL(value);
        if (url.hostname === "b23.tv") {
            return true;
        }

        if (!url.hostname.endsWith("bilibili.com")) {
            return "请输入有效的地址";
        }

        const id = url.pathname.split("/")[2];
        if (!id) {
            return "请输入有效的地址（找不到视频 ID）";
        }
        if (!(id.startsWith("BV") || id.startsWith("av"))) {
            return "请输入有效的地址（视频 ID 需要以 av 或 BV 开头）";
        }
    } catch (e) {
        return "请输入有效的地址";
    }
    return undefined;
}
