import { WebPlayInfo } from "../types";

export const findBestAudio = (dashAudio: WebPlayInfo["data"]["dash"]["audio"]) => {
    let maxQualityIndex = 0;
    dashAudio.forEach((value, index, array) => {
        if (array[maxQualityIndex].codecid < maxQualityIndex) {
            maxQualityIndex = index;
        }
    });
    return maxQualityIndex;
};

export function pickRandom<T>(item: T[]) {
    return item[Math.floor(Math.random() * item.length)];
}
