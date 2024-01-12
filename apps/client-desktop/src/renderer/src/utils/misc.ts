export function remoteExtension(origName: string) {
    const arr = origName.split(".");
    arr.pop();
    return arr.join(".");
}
