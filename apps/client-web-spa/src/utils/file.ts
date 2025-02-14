export function downloadUrl(fileName: string, href: string) {
    const el = document.createElement("a");
    el.download = fileName;
    el.href = href;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
}

/**
 * 保存字符串为文件，编码为 UTF-8
 * @param fileName 文件名
 * @param str 字符串
 * @param type mime
 */
export function saveString(fileName: string, str: unknown, type = "text/plain") {
    return downloadUrl(fileName, `data:${type};charset=utf-8,${encodeURIComponent(`${str}`)}`);
}
