import { css } from "@/styled-system/css";
import * as audio from "@/utils/audio";
import * as Slider from "@radix-ui/react-slider";
import { seek, setPreventAutoNext, useAudioProgress } from "@/utils/audio";
import { useState } from "react";
import { bsButton } from "@/components/recipes/button";
import { center } from "@/styled-system/patterns";
import * as process from "process";

function AudioSlider() {
    const { currentTime, duration, buffered } = useAudioProgress();
    const [dragInfo, setDragInfo] = useState({
        dragging: false,
        position: 0,
    });
    const [dragLock, setDragLock] = useState(false);
    const result = dragInfo.dragging ? dragInfo.position : currentTime;

    return (
        <Slider.Root
            className={css({
                position: "relative",
                display: "flex",
                alignItems: "center",
                userSelect: "none",
                touchAction: "none",
                width: "full",
                height: 4,
            })}
            value={[result]}
            max={duration}
            step={0.001}
            disabled={dragLock}
            onValueChange={([value]) => {
                if (process.env.NODE_ENV === "development") console.log("changing", value);
                setPreventAutoNext(true);
                setDragInfo({
                    dragging: true,
                    position: value,
                });
            }}
            onValueCommit={async ([value]) => {
                if (process.env.NODE_ENV === "development") console.log("committing", value);
                setDragLock(true);
                await seek(value);
                setDragLock(false);
                setDragInfo({
                    dragging: false,
                    position: value,
                });
                setPreventAutoNext(false);
            }}
            onPointerLeave={async () => {
                // todo 此 workaround 依然无法可靠解决在 Chromium 浏览器下快速滑动滑块时，不能触发音频跳转到指定位置操作的问题
                // 需要跟进：https://github.com/radix-ui/primitives/issues/1760

                // `onPointerLeave` always fired
                // Avoid redundant commits
                if (dragInfo.dragging) {
                    if (process.env.NODE_ENV === "development") console.log("committing via onPointerLeave");
                    setDragLock(true);
                    await seek(dragInfo.position);
                    setDragLock(false);
                    setDragInfo({
                        dragging: false,
                        position: dragInfo.position,
                    });
                    setPreventAutoNext(false);
                }
            }}
        >
            <Slider.Track
                className={css({
                    backgroundColor: "primary.50/20",
                    position: "relative",
                    flexGrow: 1,
                    borderRadius: "full",
                    height: "0.18rem",
                    overflow: "none",
                })}
            >
                <Slider.Range
                    className={css({
                        position: "absolute",
                        backgroundColor: "white",
                        borderRadius: "full",
                        height: "100%",
                    })}
                />
                <div
                    className={css({
                        position: "absolute",
                        backgroundColor: "primary.50/30",
                        borderRadius: "full",
                        height: "100%",
                    })}
                    style={{
                        width: `calc((100% - 1rem) * ${buffered / duration} + 1rem)`,
                    }}
                ></div>
            </Slider.Track>
            <Slider.Thumb
                className={css({
                    display: "block",
                    width: 4,
                    height: 4,
                    backgroundColor: "white",
                    boxShadow: "md",
                    borderRadius: "full",
                    transitionDuration: "fast",
                    _hover: { transform: "scale(1.25)" },
                    _focus: {
                        outline: "none",
                        boxShadow: "lg",
                    },
                })}
                aria-label="Volume"
            />
        </Slider.Root>
    );
}

export default function AudioPlayer() {
    const { current } = audio.useQueue();
    const isPlaying = !audio.useAudioPaused();
    return (
        <div
            className={center({
                pos: "sticky",
                bottom: 0,
                bg: {
                    base: "primary.500",
                    _dark: "neutral.900/75",
                },
                _dark: {
                    borderTop: "1px solid",
                    borderTopColor: "neutral.700",
                    backdropFilter: "auto",
                    backdropBlur: "lg",
                },
                w: "full",
                px: 4,
            })}
        >
            <div
                className={css({
                    w: "full",
                    maxW: "container",
                    py: 4,
                })}
            >
                <AudioSlider />
                <button
                    type={"button"}
                    disabled={!current}
                    className={bsButton({ variant: "ghost" })}
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
            </div>
            {/*<p>
                {`正在播放第 ${index} 首歌曲，名称：`}
                {current && <Link to={"/video/" + current.bvid}>{current.title}</Link>}
            </p>
            <div className={hstack()}>
                <button
                    type={"button"}
                    disabled={!current}
                    className={bsButton({ variant: "ghost" })}
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
                    className={bsButton({ variant: "ghost" })}
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
                    className={bsButton({ variant: "ghost" })}
                    onClick={() => {
                        audio.nextTrack();
                        audio.play();
                    }}
                >
                    下一首
                </button>
            </div>*/}
        </div>
    );
}
