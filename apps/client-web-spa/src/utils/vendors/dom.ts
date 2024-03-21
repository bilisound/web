const calculateCache = new Map<string, number>();
const digits = "0123456789";

export function measureNumberWidth(
    maxDigits: number,
    { className = "", overrideCache = false }: { className?: string; overrideCache?: boolean } = {},
) {
    const got = calculateCache.get(digits + "__" + className);
    if (!overrideCache && typeof got === "number") {
        return got;
    }

    // 创建不可见的临时元素
    const el = document.createElement("div");
    el.className = className;
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);

    // 测试 0-9 的所有可能性，并记录最宽的长度
    let max = 0;
    for (let i = 0; i < digits.length; i++) {
        el.textContent = digits[i].repeat(maxDigits);
        const measured = el.getBoundingClientRect().width;
        if (measured > max) {
            max = measured;
        }
    }

    // 清理现场
    document.body.removeChild(el);

    // 记录缓存，返回长度（像素）
    calculateCache.set(digits + "__" + className, max);
    return max;
}
