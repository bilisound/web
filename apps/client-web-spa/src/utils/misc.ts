import { BASE_URL } from "@/constants";

export function getImageProxyUrl(url: string, referrer: string) {
    return `${BASE_URL}/api/internal/image?url=${encodeURIComponent(url)}&referer=${encodeURIComponent("https://www.bilibili.com/video/" + referrer)}`;
}
