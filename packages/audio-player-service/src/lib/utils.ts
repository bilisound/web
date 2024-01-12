export function clamp(num: number, a: number, b: number) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    if (num > max) {
        return max;
    }
    if (num < min) {
        return min;
    }
    return num;
}
