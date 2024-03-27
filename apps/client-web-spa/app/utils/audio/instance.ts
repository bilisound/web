import { AudioQueueData } from "@/utils/audio/types";

export interface AudioInstanceInitOptions {
    queue?: AudioQueueData[];
}

export default class AudioInstance {
    public audioElement?: HTMLAudioElement;
    public queue: AudioQueueData[] = [];

    constructor(options: AudioInstanceInitOptions = {}) {
        if (options.queue) {
            this.queue = options.queue;
        }
    }
}
