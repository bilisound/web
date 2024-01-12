export interface ExtractJSONOptions {
    parsePrefix?: string
    parseSuffix?: string
    index?: number
}

export function extractJSON(regex: RegExp, str: string, options: ExtractJSONOptions = {}) {
    const parsePrefix = options.parsePrefix ?? "{";
    const parseSuffix = options.parseSuffix ?? "}";
    const index = options.index ?? 1;
    const extracted = regex.exec(str);
    if (!extracted || !extracted[index]) {
        throw new Error("Unable to extract content: no match");
    }
    return JSON.parse(parsePrefix + extracted[index] + parseSuffix);
}
