import AudioPlayerService from "./lib";
import "./main.css";
import { tween } from "./lib/tween";

const instance = AudioPlayerService.instance;

const fileInput = document.getElementById("file-input") as HTMLInputElement;
const playBtn = document.getElementById("play-btn")!;
const pauseBtn = document.getElementById("pause-btn")!;
const tweenXBtn = document.getElementById("tween-x-btn")!;
const testTween = document.getElementById("test-tween")!;

fileInput.addEventListener("change", (e) => {
    e.preventDefault();
    if (fileInput.files && fileInput.files[0]) {
        AudioPlayerService.instance.load(URL.createObjectURL(fileInput.files[0]));
    }
});

playBtn.addEventListener("click", () => {
    instance.play();
});

pauseBtn.addEventListener("click", () => {
    instance.pause();
});

tweenXBtn.addEventListener("click", () => {
    tween({
        begin: 0,
        end: 400,
        time: 2000,
    }, (value) => {
        testTween.style.transform = `translateX(${value}px)`;
    });
});
