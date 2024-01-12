import { tween } from "./tween";

export default class AudioPlayerService {
    static readonly instance = new AudioPlayerService();

    audioElement: HTMLAudioElement;

    constructor() {
        // 创建音频元素
        this.audioElement = document.createElement("audio");
        document.body.appendChild(this.audioElement);
    }

    load(src: string) {
        const { audioElement } = this;
        audioElement.src = src;
        audioElement.load();
    }

    async play() {
        const { audioElement } = this;
        audioElement.volume = 0;
        await audioElement.play();
        await tween({
            begin: 0,
            end: 1,
            time: 300,
        }, (value) => {
            audioElement.volume = value;
        });
    }

    async pause() {
        const { audioElement } = this;
        audioElement.volume = 1;
        await tween({
            begin: 1,
            end: 0,
            time: 300,
        }, (value) => {
            audioElement.volume = value;
        });
        audioElement.pause();
    }
}
