import { css } from "@/styled-system/css";
import * as audio from "@/utils/audio";
import * as Slider from "@radix-ui/react-slider";
import { seek, setPreventAutoNext, useAudioProgress } from "@/utils/audio";
import React, { useEffect, useId, useRef, useState } from "react";
import { bsIconButton } from "@/components/recipes/button";
import { center, flex, hstack, vstack } from "@/styled-system/patterns";
import { ReactComponent as IconPlay } from "@/icons/fa-solid--play.svg";
import { ReactComponent as IconPause } from "@/icons/fa-solid--pause.svg";
import { ReactComponent as IconStepBackward } from "@/icons/fa-solid--step-backward.svg";
import { ReactComponent as IconStepForward } from "@/icons/fa-solid--step-forward.svg";
import { ReactComponent as IconTarget } from "@/icons/simple-icons--target.svg";
import { ReactComponent as IconPlaylist } from "@/icons/flowbite--list-music-solid.svg";
import { ReactComponent as IconDownload } from "@/icons/fa-solid--download.svg";
import { ReactComponent as IconDisc } from "@/icons/fa-solid--compact-disc.svg";
import { secondToTimestamp } from "@bilisound2/utils";
import { Link } from "umi";
import MusicPlayingIcon from "@/components/MusicPlayingIcon";
import { useLocalStorageState } from "ahooks";
import { BILISOUND_BOTTOM_PLAYER_OPEN } from "@/constants/local-storage";
import { forwardRef } from "@chakra-ui/react";

// 播放器滑块
function AudioSlider({ disabled }: { disabled: boolean }) {
    const { currentTime, duration, buffered } = useAudioProgress();
    const [dragInfo, setDragInfo] = useState({
        dragging: false,
        position: 0,
    });
    // const [dragLock, setDragLock] = useState(false);
    const result = dragInfo.dragging ? dragInfo.position : currentTime;
    const loadProgress = buffered / duration;

    return (
        <Slider.Root
            className={css({
                position: "relative",
                display: "flex",
                alignItems: "center",
                userSelect: "none",
                touchAction: "none",
                width: "full",
                height: 3,
            })}
            value={[result]}
            max={duration}
            step={0.001}
            disabled={disabled}
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
                // setDragLock(true);
                await seek(value);
                // setDragLock(false);
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
                if (!dragInfo.dragging) {
                    return;
                }
                if (process.env.NODE_ENV === "development") console.log("committing via onPointerLeave");
                // setDragLock(true);
                await seek(dragInfo.position);
                // setDragLock(false);
                setDragInfo({
                    dragging: false,
                    position: dragInfo.position,
                });
                setPreventAutoNext(false);
            }}
        >
            <Slider.Track
                className={css({
                    backgroundColor: "primary.50/20",
                    position: "relative",
                    flexGrow: 1,
                    borderRadius: "full",
                    height: "0.18rem",
                    overflow: "hidden",
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
                        width: loadProgress ? `calc((100% - 1rem) * ${loadProgress} + 1rem)` : 0,
                    }}
                ></div>
            </Slider.Track>
            <Slider.Thumb
                className={css({
                    display: "block",
                    width: 3,
                    height: 3,
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

// 当前播放进度
function AudioTime() {
    const { currentTime } = useAudioProgress();
    return <>{secondToTimestamp(currentTime, { showMillisecond: false })}</>;
}

// 播放器本体
const AudioPlayerInner = forwardRef<React.JSX.IntrinsicElements["div"], "div">((props, ref) => {
    const { current } = audio.useQueue();
    const isPlaying = !audio.useAudioPaused();

    return (
        <div
            className={flex({
                w: "full",
                maxW: "container",
                gap: 5,
                alignItems: "center",
            })}
            {...props}
            ref={ref}
        >
            <div className={css({ flex: "auto", minW: 0, pt: 4, pb: 3 })}>
                <AudioSlider disabled={!current} />
                <div
                    className={css({
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontFamily: "roboto",
                        fontSize: "xs",
                        fontWeight: 500,
                        color: "white",
                        mt: 1,
                        display: ["flex", "none"],
                    })}
                >
                    <div>
                        <AudioTime />
                    </div>
                    <div>{secondToTimestamp(current?.duration ?? 0, { showMillisecond: false })}</div>
                </div>
                <div
                    className={`dark ${hstack({
                        gap: 0,
                        mt: [1, 2, 2],
                        justifyContent: ["center", "flex-start"],
                        pos: "relative",
                    })}`}
                >
                    <div className={hstack({ gap: 0 })}>
                        <button
                            type={"button"}
                            disabled={!current}
                            className={bsIconButton({ variant: "ghost" })}
                            onClick={() => {
                                audio.prevTrack();
                                audio.play();
                            }}
                            aria-label={"上一首"}
                        >
                            <IconStepBackward className={css({ transform: "scaleX(1.25)" })} />
                        </button>
                        <button
                            type={"button"}
                            disabled={!current}
                            className={bsIconButton({ variant: "ghost" })}
                            onClick={() => {
                                if (isPlaying) {
                                    audio.pause();
                                } else {
                                    audio.play();
                                }
                            }}
                            aria-label={isPlaying ? "暂停" : "播放"}
                        >
                            {isPlaying ? <IconPause /> : <IconPlay />}
                        </button>
                        <button
                            type={"button"}
                            disabled={!current}
                            className={bsIconButton({ variant: "ghost" })}
                            onClick={() => {
                                audio.nextTrack();
                                audio.play();
                            }}
                            aria-label={"下一首"}
                        >
                            <IconStepForward className={css({ transform: "scaleX(1.25)" })} />
                        </button>
                    </div>
                    <Link
                        to={current ? `/video/${current.bvid}` : ""}
                        className={css(bsIconButton.raw({ variant: "ghost" }), {
                            pos: ["absolute", "static"],
                            left: 0,
                            top: "50%",
                            transform: ["translateY(-50%)", "none"],
                        })}
                        aria-label={"前往当前正在播放的曲目页面"}
                    >
                        <IconTarget />
                    </Link>
                    <div
                        className={hstack({
                            gap: 0,
                            pos: "absolute",
                            right: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                        })}
                    >
                        <Link className={bsIconButton({ variant: "ghost" })} aria-label={"查看播放列表"} to={"/queue"}>
                            <IconPlaylist />
                        </Link>
                        <button
                            type={"button"}
                            disabled={!current}
                            className={bsIconButton({ variant: "ghost" })}
                            aria-label={`下载当前播放的曲目`}
                        >
                            <IconDownload />
                        </button>
                    </div>
                    <div
                        className={css({
                            fontFamily: "roboto",
                            fontSize: "sm",
                            fontWeight: 500,
                            ms: 3,
                            color: "white",
                            display: ["none", "block"],
                        })}
                    >
                        <AudioTime />
                        {` / ${secondToTimestamp(current?.duration ?? 0, { showMillisecond: false })}`}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default function AudioPlayer() {
    // 播放器展开控制
    const [open, setOpen] = useLocalStorageState(BILISOUND_BOTTOM_PLAYER_OPEN, {
        defaultValue: true,
    });
    const [actualOpen, setActualOpen] = useState(false);
    const timer = useRef<any>();
    const playerId = useId();

    useEffect(() => {
        if (open) {
            setActualOpen(true);
        } else {
            timer.current = setTimeout(() => {
                setActualOpen(false);
            }, 300);
        }
        return () => {
            clearTimeout(timer.current);
        };
    }, [open]);

    // 播放状态
    const isPlaying = !audio.useAudioPaused();

    return (
        <>
            {/* 播放器 */}
            <div
                className={center({
                    pos: "fixed",
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
                    transition: "transform",
                    transitionDuration: "slow",
                    transform: open ? "none" : "translateY(100%)",
                    h: ["6.5rem", "5.5rem"],
                })}
            >
                {/* 右侧按钮（有做多个按钮的预留） */}
                <div
                    className={vstack({
                        gap: 4,
                        pos: "absolute",
                        right: 4,
                        top: -4,
                        transform: "translate(0, -100%)",
                    })}
                >
                    <button
                        type={"button"}
                        className={center({
                            w: 12,
                            h: 12,
                            bg: { base: "primary.500", _dark: "neutral.700" },
                            rounded: "lg",
                            color: "white",
                            cursor: "pointer",
                        })}
                        onClick={() => setOpen(prevState => !prevState)}
                        aria-label={open ? "收起播放器" : "展开播放器"}
                        aria-expanded={open}
                        aria-controls={playerId}
                    >
                        {isPlaying ? <MusicPlayingIcon /> : <IconDisc className={css({ w: 4, h: 4 })} />}
                    </button>
                </div>
                {/* 播放器本体 */}
                {actualOpen && <AudioPlayerInner id={playerId} />}
            </div>
            {/* 用来把页面底部撑起来的东西 */}
            {open && <div aria-hidden={"true"} className={css({ h: ["6.5rem", "5.5rem"] })}></div>}
        </>
    );
}