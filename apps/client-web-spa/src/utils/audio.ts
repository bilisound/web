import { useSyncExternalStore } from "react";
import { v4 } from "uuid";
import { BILISOUND_DEFAULT_PLAYLIST, BILISOUND_QUEUE_INDEX } from "@/constants/local-storage";

const NO_SONG_WARNING_MESSAGE = "目前没有可以播放的音频";

export interface AudioQueueData {
    key: string;
    bvid: string;
    episode: number;
    url: string;
    title: string;
    author: string;
    duration: number;
    imgUrl: string;
}

// 实例初始化
// 在开发模式中，播放器实例不会被 HMR 处理，所以需要清理已经存在的实例
const existed = document.querySelectorAll("audio[data-managed-by-bilisound]");
existed.forEach(e => {
    e.remove();
});

const instance = document.createElement("audio");
instance.dataset.managedByBilisound = "🥺";

// 队列
const queue: AudioQueueData[] = JSON.parse(localStorage.getItem(BILISOUND_DEFAULT_PLAYLIST) || "[]");
const queueEventTriggers = new Map<string, () => void>();

// 队列初始化
queue.forEach((e, i) => {
    e.key = `__${i}`;
});

// 其它参数初始化
let index = Number(localStorage.getItem(BILISOUND_QUEUE_INDEX) || "-1") || -1;
let snapshotQueue = {
    queue,
    current: queue[index] as AudioQueueData | undefined,
    index,
};
let preventAutoNext = false;

if (index >= 0) {
    instance.src = queue[index].url;
}

function callAllQueueEventTriggers() {
    for (const entry of queueEventTriggers.entries()) {
        entry[1]();
    }
}

/**
 * 播放
 */
export function play() {
    if (index < 0) {
        console.warn(NO_SONG_WARNING_MESSAGE);
        return Promise.resolve();
    }
    return instance.play();
}

/**
 * 暂停
 */
export function pause() {
    if (index < 0) {
        console.warn(NO_SONG_WARNING_MESSAGE);
        return;
    }
    return instance.pause();
}

/**
 * 切换播放/暂停状态
 */
export function toggle() {
    if (instance.paused) {
        play();
    } else {
        pause();
    }
}

function commitQueue() {
    localStorage.setItem(
        BILISOUND_DEFAULT_PLAYLIST,
        JSON.stringify(queue, (key, value) => {
            if (key === "key") {
                return undefined;
            }
            return value;
        }),
    );
}

function commitIndex() {
    localStorage.setItem(BILISOUND_QUEUE_INDEX, String(index));
}

let seekPromiseCount = 0;

export function seek(to: number) {
    seekPromiseCount++;
    if (process.env.NODE_ENV === "development") console.log("seekPromiseCount " + seekPromiseCount + " start!");
    return new Promise<void>(resolve => {
        function handleSeekDone() {
            resolve();
            if (process.env.NODE_ENV === "development") console.log("seekPromiseCount " + seekPromiseCount + " end!");
            instance.removeEventListener("seeked", handleSeekDone);
        }
        instance.addEventListener("seeked", handleSeekDone);
        instance.currentTime = to || 0;
    });
}

/**
 * 跳转到播放列表指定曲目
 */
export function jump(to: number, { restorePlayState }: { restorePlayState?: boolean } = {}) {
    if (to < 0 || to >= queue.length) {
        throw new Error("非法的索引值");
    }
    index = to;
    commitIndex();
    const prevPlayState = !instance.paused;
    const obj = queue[to];
    instance.src = obj.url;

    if (restorePlayState && prevPlayState) {
        play();
    }

    // 更新 snapshot
    snapshotQueue = {
        queue,
        current: queue[index],
        index,
    };
    callAllQueueEventTriggers();
}

/**
 * 下一首
 */
export function nextTrack() {
    jump(index >= queue.length - 1 ? 0 : index + 1);
}

/**
 * 上一首
 */
export function prevTrack({ alwaysJump = false }: { alwaysJump?: boolean } = {}) {
    // https://ux.stackexchange.com/questions/80335/why-does-previous-button-in-music-player-apps-start-the-current-track-from-the-b
    if (!alwaysJump && !instance.paused && instance.currentTime > 3) {
        instance.currentTime = 0;
        return;
    }
    jump(index <= 0 ? queue.length - 1 : index - 1);
}

/**
 * 设置防止自动跳转到下一首
 */
export function setPreventAutoNext(to: boolean) {
    preventAutoNext = to;
}

/**
 * 添加到播放列表
 */
export async function pushQueue(data: Omit<AudioQueueData, "key">) {
    queue.push({ ...data, key: v4() });
    commitQueue();
    jump(queue.length - 1);
}

/**
 * 从播放列表中查找
 * @param id
 * @param episode
 */
export function findFromQueue(id: string, episode: number) {
    return queue.findIndex(e => e.bvid === id && e.episode === episode);
}

/**
 * 播放完毕事件
 */
instance.addEventListener("ended", async () => {
    if (preventAutoNext) {
        return;
    }
    jump(index >= queue.length - 1 ? 0 : index + 1);
    await play();
});

document.body.appendChild(instance);

// useAudioPlayer (订阅)
function getSnapshotAudioPlayer() {
    return instance.paused;
}

// useAudioPlayer (获取状态)
function subscribeAudioPlayer(callback: () => void) {
    instance.addEventListener("play", callback);
    instance.addEventListener("pause", callback);
    return () => {
        instance.removeEventListener("play", callback);
        instance.removeEventListener("pause", callback);
    };
}

// useAudioPlayer
export function useAudioPaused() {
    return useSyncExternalStore(subscribeAudioPlayer, getSnapshotAudioPlayer);
}

let audioProgress = {
    currentTime: 0,
    duration: 0,
    buffered: 0,
};

// useAudioProgress (订阅)
function subscribeAudioProgress(callback: () => void) {
    function update() {
        audioProgress = {
            currentTime: instance.currentTime, // 当前播放时间
            duration: instance.duration, // 音频总长度
            buffered: instance.buffered.length > 0 ? instance.buffered.end(instance.buffered.length - 1) : 0, // 已加载长度
        };
        callback();
    }
    instance.addEventListener("timeupdate", update);
    instance.addEventListener("loadedmetadata", update);
    instance.addEventListener("progress", update);
    return () => {
        instance.removeEventListener("timeupdate", update);
        instance.removeEventListener("loadedmetadata", update);
        instance.removeEventListener("progress", update);
    };
}

// useAudioProgress (获取状态)
function getSnapshotAudioProgress() {
    return audioProgress;
}

// useAudioProgress
export function useAudioProgress() {
    return useSyncExternalStore(subscribeAudioProgress, getSnapshotAudioProgress);
}

// useQueue (订阅)
function subscribeQueue(callback: () => void) {
    const id = v4();
    queueEventTriggers.set(id, callback);
    return () => {
        queueEventTriggers.delete(id);
    };
}

// useQueue (获取状态)
function getSnapshotQueue() {
    return snapshotQueue;
}

// useQueue
export function useQueue() {
    return useSyncExternalStore(subscribeQueue, getSnapshotQueue);
}
