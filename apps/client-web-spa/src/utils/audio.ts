import { useSyncExternalStore } from "react";
import { v4 } from "uuid";
import * as process from "process";

const NO_SONG_WARNING_MESSAGE = "目前没有可以播放的音频";

export interface AudioQueueData {
    id: string;
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
const queue: AudioQueueData[] =
    process.env.NODE_ENV === "development"
        ? [
              {
                  author: "丨逍_遥丨",
                  bvid: "BV1hS4y1x77h",
                  duration: 290,
                  episode: 2,
                  id: "0.27697598951563807",
                  title: "02.White Canvas (feat. 藍月なくる) - rejection",
                  url: "https://bilisound.tuu.run/api/internal/resource?id=BV1hS4y1x77h&episode=2",
                  imgUrl: "http://i2.hdslb.com/bfs/archive/0515f17ae74f1a18e3ea46d10d6985cff9593be2.jpg",
              },
              {
                  author: "丨逍_遥丨",
                  bvid: "BV1hS4y1x77h",
                  duration: 183,
                  episode: 4,
                  id: "0.30648341521343925",
                  title: "04.DROPS (feat. Such) - Zekk_&_poplavor",
                  url: "https://bilisound.tuu.run/api/internal/resource?id=BV1hS4y1x77h&episode=4",
                  imgUrl: "http://i2.hdslb.com/bfs/archive/0515f17ae74f1a18e3ea46d10d6985cff9593be2.jpg",
              },
              {
                  author: "丨逍_遥丨",
                  bvid: "BV1hS4y1x77h",
                  duration: 191,
                  episode: 6,
                  id: "0.8535214448678625",
                  title: "06.マドネス (feat. りんたる) - Kakeru",
                  url: "https://bilisound.tuu.run/api/internal/resource?id=BV1hS4y1x77h&episode=6",
                  imgUrl: "http://i2.hdslb.com/bfs/archive/0515f17ae74f1a18e3ea46d10d6985cff9593be2.jpg",
              },
              {
                  author: "王道然",
                  bvid: "BV1Ab411g7qQ",
                  duration: 268,
                  episode: 1,
                  id: "0.8178759900032173",
                  title: "ネオンライト【霓虹灯】 星宮とと×TEMPLIME",
                  url: "https://bilisound.tuu.run/api/internal/resource?id=BV1Ab411g7qQ&episode=1",
                  imgUrl: "http://i0.hdslb.com/bfs/archive/8137a6871c5b20afc9b6538a4621558cf4d0c54a.jpg",
              },
              {
                  author: "KiraraMagic",
                  bvid: "BV1AK421x7rU",
                  duration: 176,
                  episode: 1,
                  id: "0.19105768644985055",
                  title: "清新可爱的海底大冒险单曲《Aquatic》",
                  url: "https://bilisound.tuu.run/api/internal/resource?id=BV1AK421x7rU&episode=1",
                  imgUrl: "http://i0.hdslb.com/bfs/archive/10d849b8f5584c32b281199fc6d388e8cda597c7.jpg",
              },
              {
                  author: "東雪蓮Official",
                  bvid: "BV1ZC4y1n7kb",
                  duration: 219,
                  episode: 1,
                  id: "0.948302209375957",
                  title: "砂時計の魔法(沙漏的魔法) - 東 雪蓮",
                  url: "https://bilisound.tuu.run/api/internal/resource?id=BV1ZC4y1n7kb&episode=1",
                  imgUrl: "http://i2.hdslb.com/bfs/archive/8f1e43f273c57a4e88ad80dd6f6091b886d47c1a.jpg",
              },
              {
                  author: "媛二媛二",
                  bvid: "BV1U841167fJ",
                  duration: 197,
                  episode: 1,
                  id: "0.5584388689188164",
                  title: "“请与我共同 陷入”【Limbo】",
                  url: "https://bilisound.tuu.run/api/internal/resource?id=BV1U841167fJ&episode=1",
                  imgUrl: "http://i2.hdslb.com/bfs/archive/3ac8d283f59a54bedc0440e8f76287a15ed7d83c.jpg",
              },
          ]
        : [];
const queueEventTriggers = new Map<string, () => void>();
let index = -1;
let snapshotQueue = {
    queue,
    current: queue[index] as AudioQueueData | undefined,
    index,
};
let preventAutoNext = false;

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

export function toggle() {
    if (instance.paused) {
        play();
    } else {
        pause();
    }
}

let seekPromiseCount = 0;

export function seek(to: number) {
    seekPromiseCount++;
    console.log("seekPromiseCount " + seekPromiseCount + " start!");
    return new Promise<void>(resolve => {
        function handleSeekDone() {
            resolve();
            console.log("seekPromiseCount " + seekPromiseCount + " end!");
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
export async function pushQueue(data: AudioQueueData) {
    queue.push(data);
    console.log(queue);
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
