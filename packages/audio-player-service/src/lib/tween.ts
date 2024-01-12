import { clamp } from "./utils";

export interface TweenOptions {
    /**
     * 开始值
     */
    begin: number
    /**
     * 结束值
     */
    end: number
    /**
     * 用时
     */
    time: number
}

export function tween(options: TweenOptions, callback: (value: number) => void): Promise<void> {
    return new Promise((resolve) => {
        const {
            begin,
            end,
            time,
        } = options;
        const beginTime = new Date().getTime();
        function tweenExecutor() {
            const timePassed = new Date().getTime() - beginTime;
            const initial = clamp(begin + ((timePassed / time) * (end - begin)), begin, end);
            callback(initial);
            if (timePassed >= time) {
                callback(end);
                resolve();
                return;
            }
            requestAnimationFrame(tweenExecutor);
        }
        tweenExecutor();
    });
}
