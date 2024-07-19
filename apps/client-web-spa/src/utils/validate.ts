export function isInteger(value: number | string) {
    return Math.floor(Number(value)) === Number(value);
}
