export function downloadUrl(fileName: string, href: string) {
    const el = document.createElement("a");
    el.download = fileName;
    el.href = href;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
}
