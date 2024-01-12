import { BASE_URL } from "@/constants";

export function getImageProxyUrl(url: string, referrer: string) {
    return `${BASE_URL}/api/internal/img-proxy?url=${encodeURIComponent(url)}&referrer=${encodeURIComponent(referrer)}`;
}
