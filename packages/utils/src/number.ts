import { filesize } from "filesize";

/**
 * 将文件大小转换为人类可读格式
 * @param size 文件大小（字节）
 */
export function toHumanReadableSize(size: number) {
    return filesize(size, { base: 2, standard: "jedec" });
}

/**
 * 将秒数转换为人类可读格式（转换选项）
 */
export interface SecondToTimestampOptions {
    /**
     * 显示毫秒
     */
    showMillisecond?: boolean
    /**
     * 显示小时（如果超过 60 分钟）
     */
    showHour?: boolean
}

/**
 * 将秒数转换为人类可读格式
 * @param second 秒数
 * @param options 转换选项
 */
export function secondToTimestamp(second: number, options: SecondToTimestampOptions = {}): string {
    function floorString(num: number, pad = 2) {
        return String(Math.floor(num) || 0).padStart(pad, "0");
    }

    const { showMillisecond = true, showHour = true } = options;
    if (second > 3600 && showHour) {
        return `${floorString(second / 3600)}:${secondToTimestamp(second % 3600, {
            showMillisecond,
            showHour: false,
        })}`;
    }
    let built = `${floorString(second / 60)}:${floorString(second % 60)}`;
    if (showMillisecond) {
        built += `${(second % 1).toFixed(3).slice(1)}`;
    }
    return built;
}
