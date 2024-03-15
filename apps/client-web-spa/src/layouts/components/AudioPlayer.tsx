import { css } from "@/styled-system/css";
import * as audio from "@/utils/audio";
import { bsButton } from "@/components/recipes/button";
import { hstack } from "@/styled-system/patterns";
import { Link } from "umi";

export default function AudioPlayer() {
    const { index, current } = audio.useQueue();
    const { isPlaying } = audio.useAudioPlayer();
    return (
        <div
            className={css({
                pos: "fixed",
                left: 16,
                top: 16,
                bg: "white",
                color: "black",
                boxShadow: "xl",
                borderRadius: "md",
                p: 4,
            })}
        >
            <p>
                {`正在播放第 ${index} 首歌曲，名称：`}
                {current && <Link to={"/video/" + current.bvid}>{current.title}</Link>}
            </p>
            <div className={hstack()}>
                <button
                    type={"button"}
                    disabled={!current}
                    className={bsButton()}
                    onClick={() => {
                        audio.prevTrack();
                        audio.play();
                    }}
                >
                    上一首
                </button>
                <button
                    type={"button"}
                    disabled={!current}
                    className={bsButton()}
                    onClick={() => {
                        if (isPlaying) {
                            audio.pause();
                        } else {
                            audio.play();
                        }
                    }}
                >
                    {isPlaying ? "暂停" : "播放"}
                </button>
                <button
                    type={"button"}
                    disabled={!current}
                    className={bsButton()}
                    onClick={() => {
                        audio.nextTrack();
                        audio.play();
                    }}
                >
                    下一首
                </button>
            </div>
        </div>
    );
}
