/**
 * 根据一个数组的片段生成新的数组
 * @param orig
 * @param from
 * @param to
 * @param callback
 */
export function sliceMap<T, U>(
    orig: T[],
    from: number | undefined,
    to: number | undefined,
    callback: (element: T, index: number, original: T[]) => U,
): U[] {
    return orig.slice(from, to).map(callback);
}
