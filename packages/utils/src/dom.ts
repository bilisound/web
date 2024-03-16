/**
 * 反转义 HTML 字符串至常规字符串。
 *
 * 例如，`this -&gt; &quot;` 会被转换成 `this -> "`。
 * @param input
 */
export function htmlDecode(input: string): string {
    // 创建一个虚拟的DOM元素来作为解码器
    const textarea = document.createElement("textarea");
    textarea.innerHTML = input;
    return textarea.value;
}
