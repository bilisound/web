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

export interface BilisoundAudioServiceStatus {
    queue: AudioQueueData[];
    current?: AudioQueueData;
    index: number;
}
