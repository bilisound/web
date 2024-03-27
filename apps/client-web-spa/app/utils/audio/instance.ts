import { AudioQueueData, BilisoundAudioServiceStatus } from "@/utils/audio/types";
import { v4 } from "uuid";
import { getImageProxyUrl } from "@/utils/misc";
import { BASE_URL } from "@/constants";

export interface BilisoundAudioServiceOptions {
    queue?: AudioQueueData[];
    index?: number;
}

export default class BilisoundAudioService extends EventTarget {
    /**
     * HTMLAudioElement 本体
     */
    public audioElement?: HTMLAudioElement;
    /**
     * 播放队列
     */
    public queue: AudioQueueData[];
    /**
     * 实例 ID
     */
    public id: string;
    /**
     * 当前播放内容在队列中的位置
     */
    public index: number;
    /**
     * 播放状态
     */
    public status: BilisoundAudioServiceStatus;
    /**
     * 播放状态变化钩子
     * @private
     */
    private statusEventTriggers = new Map<string, () => void>();
    /**
     * 是否正在播放变化钩子
     * @private
     */
    private isPlayingEventTriggers = new Map<string, () => void>();
    /**
     * 播放进度
     */
    public audioProgress = {
        currentTime: 0,
        duration: 0,
        buffered: 0,
    };
    /**
     * 播放进度变化钩子
     * @private
     */
    private audioProgressEventTriggers = new Map<string, () => void>();
    /**
     * 防止自动跳转到下一曲
     */
    public preventAutoNext = false;
    /**
     * 进度调整 Promise ID 计数器
     */
    private seekPromiseCount = 0;

    constructor({ queue = [], index = -1 }: BilisoundAudioServiceOptions = {}) {
        super();
        this.id = v4();
        this.queue = queue;
        this.index = index;
        this.status = {
            queue,
            current: undefined,
            index,
        };
        // 这段代码可能会在服务端被执行，所以……
        if (typeof document !== "undefined") {
            const el = document.createElement("audio");
            el.dataset.managedByBilisound = this.id;
            el.addEventListener("play", this.emitIsPlayingEvents.bind(this));
            el.addEventListener("pause", this.emitIsPlayingEvents.bind(this));
            el.addEventListener("timeupdate", this.emitAudioProgressEvents.bind(this));
            el.addEventListener("loadedmetadata", this.emitAudioProgressEvents.bind(this));
            el.addEventListener("progress", this.emitAudioProgressEvents.bind(this));
            el.addEventListener("ended", this.handleEnded.bind(this));
            navigator.mediaSession.setActionHandler("previoustrack", () => this.prevTrack.bind(this));
            navigator.mediaSession.setActionHandler("nexttrack", () => this.nextTrack.bind(this));
            document.body.appendChild(el);
            this.audioElement = el;
        }
    }

    destroy() {
        this.statusEventTriggers.clear();
        this.isPlayingEventTriggers.clear();
        this.audioElement?.remove();
    }

    /**
     * 更新 Media Session，这样用户可以使用媒体键或在锁屏界面控制 Bilisound
     */
    private updateMediaSession() {
        if (!this.status.current) {
            navigator.mediaSession.metadata = null;
            return;
        }
        navigator.mediaSession.metadata = new MediaMetadata({
            title: this.status.current.title,
            artist: this.status.current.author,
            artwork: [{ src: getImageProxyUrl(this.status.current.imgUrl, this.status.current.bvid) }],
        });
    }

    /**
     * 播放
     */
    play() {
        const { audioElement } = this;
        if (!audioElement) {
            return Promise.resolve();
        }
        return audioElement.play();
    }

    /**
     * 暂停
     */
    pause() {
        this.audioElement?.pause();
    }

    /**
     * 切换播放/暂停状态
     */
    toggle() {
        const { audioElement } = this;
        if (!audioElement) {
            return;
        }
        if (audioElement.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    /**
     * 调整播放进度
     * @param to
     */
    seek(to: number) {
        this.seekPromiseCount++;
        const { audioElement } = this;
        if (!audioElement) {
            return Promise.resolve();
        }
        return new Promise<void>(resolve => {
            function handleSeekDone() {
                resolve();
                audioElement?.removeEventListener("seeked", handleSeekDone);
            }
            audioElement.addEventListener("seeked", handleSeekDone);
            audioElement.currentTime = to || 0;
        });
    }

    /**
     * 跳转到播放列表指定曲目
     */
    jump(to: number, { restorePlayState }: { restorePlayState?: boolean } = {}) {
        const { audioElement } = this;
        if (!audioElement) {
            return;
        }
        if (to < 0 || to >= this.queue.length) {
            throw new Error("非法的索引值");
        }
        this.index = to;
        const prevPlayState = !audioElement.paused;
        const obj = this.queue[to];
        audioElement.src = obj.url;
        this.emitIsPlayingEvents();

        if (restorePlayState && prevPlayState) {
            this.play();
        }

        // 更新 snapshot
        this.status = {
            queue: this.queue,
            current: this.queue[this.index],
            index: this.index,
        };
        this.updateMediaSession();
        this.emitStatusEvents();
        this.handleIndexUpdate();
    }

    /**
     * 下一首
     */
    nextTrack() {
        this.jump(this.index >= this.queue.length - 1 ? 0 : this.index + 1, { restorePlayState: true });
    }

    /**
     * 上一首
     */
    prevTrack({ alwaysJump = false }: { alwaysJump?: boolean } = {}) {
        const { audioElement } = this;
        if (!audioElement) {
            return;
        }
        // https://ux.stackexchange.com/questions/80335/why-does-previous-button-in-music-player-apps-start-the-current-track-from-the-b
        if (!alwaysJump && !audioElement.paused && audioElement.currentTime > 3) {
            audioElement.currentTime = 0;
            return;
        }
        this.jump(this.index <= 0 ? this.queue.length - 1 : this.index - 1, { restorePlayState: true });
    }

    /**
     * 设置防止自动跳转到下一首
     */
    setPreventAutoNext(to: boolean) {
        this.preventAutoNext = to;
    }

    /**
     * 添加到播放列表
     */
    pushQueue(data: Omit<AudioQueueData, "key" | "url">) {
        this.queue.push({
            ...data,
            key: v4(),
            url: `${BASE_URL}/api/internal/resource?id=${data.bvid}&episode=${data.episode}`,
        });
        this.handleQueueUpdate();
        this.jump(this.queue.length - 1);
    }

    /**
     * 从播放列表中查找
     * @param id
     * @param episode
     */
    findFromQueue(id: string, episode: number) {
        return this.queue.findIndex(e => e.bvid === id && e.episode === episode);
    }

    /**
     * 替换当前的播放列表
     * @param newQueue
     */
    replaceQueue(newQueue: AudioQueueData[]) {
        const { audioElement } = this;
        if (!audioElement) {
            return;
        }
        this.queue = newQueue;
        this.handleQueueUpdate();
        this.index = this.queue.length > 0 ? 0 : -1;
        audioElement.src = this.queue[this.index]?.url ?? "";

        // 更新 snapshot
        this.status = {
            queue: this.queue,
            current: this.queue[this.index],
            index: this.index,
        };
        this.emitStatusEvents();
    }

    /**
     * 播放完毕事件
     */
    async handleEnded() {
        if (this.preventAutoNext) {
            return;
        }
        this.nextTrack();
        await this.play();
    }

    // =========================================================================

    /**
     * 触发所有的 isPlaying 变更事件的回调
     * @private
     */
    private emitIsPlayingEvents() {
        for (const isPlayingEventTrigger of this.isPlayingEventTriggers.values()) {
            isPlayingEventTrigger();
        }
    }

    /**
     * [React 用] 获取 isPlaying 的当前状态
     */
    getSnapshotIsPlaying() {
        return !this.audioElement?.paused;
    }

    /**
     * [React 用] 订阅 isPlaying
     * @param callback
     */
    subscribeIsPlaying(callback: () => void) {
        const id = v4();
        this.isPlayingEventTriggers.set(id, callback);
        return () => {
            this.isPlayingEventTriggers.delete(id);
        };
    }

    // =========================================================================

    /**
     * 触发所有的 status 变更事件的回调
     * @private
     */
    private emitStatusEvents() {
        for (const statusEventTrigger of this.statusEventTriggers.values()) {
            statusEventTrigger();
        }
    }

    /**
     * [React 用] 获取 status 的当前状态
     */
    getSnapshotStatus() {
        return this.status;
    }

    /**
     * [React 用] 订阅 status
     * @param callback
     */
    subscribeStatus(callback: () => void) {
        const id = v4();
        this.statusEventTriggers.set(id, callback);
        return () => {
            this.statusEventTriggers.delete(id);
        };
    }

    // =========================================================================

    /**
     * 触发所有的 audioProgress 变更事件的回调
     * @private
     */
    private emitAudioProgressEvents() {
        const { audioElement } = this;
        if (!audioElement) {
            return;
        }
        this.audioProgress = {
            // 当前播放时间
            currentTime: audioElement.currentTime,
            // 音频总长度
            duration: audioElement.duration,
            // 已加载长度
            buffered:
                audioElement.buffered.length > 0 ? audioElement.buffered.end(audioElement.buffered.length - 1) : 0,
        };
        for (const audioProgressEventTrigger of this.audioProgressEventTriggers.values()) {
            audioProgressEventTrigger();
        }
    }

    /**
     * [React 用] 获取 audioProgress 的当前状态
     */
    getSnapshotAudioProgress() {
        return this.audioProgress;
    }

    /**
     * [React 用] 订阅 audioProgress
     * @param callback
     */
    subscribeAudioProgress(callback: () => void) {
        const id = v4();
        this.audioProgressEventTriggers.set(id, callback);
        return () => {
            this.audioProgressEventTriggers.delete(id);
        };
    }

    handleQueueUpdate() {
        const event = new CustomEvent("queueUpdate", {
            detail: this.queue,
        });
        this.dispatchEvent(event);
    }

    handleIndexUpdate() {
        const event = new CustomEvent("indexUpdate", {
            detail: this.index,
        });
        this.dispatchEvent(event);
    }
}
