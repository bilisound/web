import { useSyncExternalStore } from "react";
import { v4 } from "uuid";

export interface AudioQueueData {
    id: string;
    bvid: string;
    episode: number;
    url: string;
    title: string;
    author: string;
    duration: number;
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
const queue: AudioQueueData[] = [];
const queueEventTriggers = new Map<string, () => void>();
let index = -1;
let snapshotQueue = {
    queue,
    current: queue[index] as AudioQueueData | undefined,
    index,
};

function callAllQueueEventTriggers() {
    for (const entry of queueEventTriggers.entries()) {
        entry[1]();
    }
}

/**
 * 播放
 */
export function play() {
    return instance.play();
}

/**
 * 暂停
 */
export function pause() {
    return instance.pause();
}

/**
 * 跳转到播放列表指定曲目
 */
export function jump(to: number) {
    index = to;
    const obj = queue[to];
    instance.src = obj.url;

    // 更新 snapshot
    snapshotQueue = {
        queue,
        current: queue[index],
        index,
    };
    callAllQueueEventTriggers();
}

export function nextTrack() {
    jump(index >= queue.length - 1 ? 0 : index + 1);
}

export function prevTrack() {
    jump(index <= 0 ? queue.length - 1 : index - 1);
}

/**
 * 添加到播放列表
 */
export async function pushQueue(data: AudioQueueData) {
    queue.push(data);
    console.log(queue);
    jump(queue.length - 1);
}

instance.addEventListener("ended", async () => {
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
export function useAudioPlayer() {
    const state = useSyncExternalStore(subscribeAudioPlayer, getSnapshotAudioPlayer);

    return {
        instance,
        isPlaying: !state,
    };
}

// useAudioProgress (订阅)
function subscribeAudioProgress(callback: () => void) {
    instance.addEventListener("timeupdate", callback);
    instance.addEventListener("loadedmetadata", callback);
    instance.addEventListener("progress", callback);
    return () => {
        instance.removeEventListener("timeupdate", callback);
        instance.removeEventListener("loadedmetadata", callback);
        instance.removeEventListener("progress", callback);
    };
}

// useAudioProgress (获取状态)
function getSnapshotAudioProgress() {
    return {
        currentTime: instance.currentTime, // 当前播放时间
        duration: instance.duration, // 音频总长度
        buffered: instance.buffered.length > 0 ? instance.buffered.end(instance.buffered.length - 1) : 0, // 已加载长度
    };
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
