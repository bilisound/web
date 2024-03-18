import { css, cva } from "@/styled-system/css";
import { center, flex, vstack } from "@/styled-system/patterns";
import { AudioQueueData, jump, toggle, useAudioPaused, useQueue } from "@/utils/audio";
import { memo, useCallback } from "react";
import MusicPlayingIcon from "@/components/MusicPlayingIcon";
import { ReactComponent as IconPause } from "@/icons/fa-solid--pause.svg";
import { ReactComponent as IconMobile } from "@/icons/fa-solid--mobile-alt.svg";
import { ReactComponent as IconEdit } from "@/icons/fa-solid--edit.svg";
import { ReactComponent as IconTrash } from "@/icons/fa-solid--trash-alt.svg";
import { bsButton } from "@/components/recipes/button";

const playListItemRoot = cva({
    base: {
        rounded: "lg",
        transitionProperty: "background-color, box-shadow",
        transitionDuration: "fast",
        _hover: {
            bg: {
                base: "primary.900/5",
                _dark: "primary.100/5",
            },
        },
        _active: {
            fontWeight: 600,
            bg: {
                base: "primary.700",
            },
            color: "white",
            boxShadow: "md",
            _hover: {
                bg: {
                    base: "primary.600",
                    _dark: "primary.600",
                },
            },
        },
    },
});

function Title() {
    const { queue } = useQueue();
    return (
        <h2
            className={css({
                fontSize: "xl",
                fontWeight: 600,
                lineHeight: 1.5,
                ps: 4,
            })}
        >{`播放队列 (${queue.length})`}</h2>
    );
}

function PlaylistItemRaw({
    isActive,
    isPlaying,
    data,
    index,
    onJump,
}: {
    isActive: boolean;
    isPlaying: boolean;
    data: AudioQueueData;
    index: number;
    onJump: (index: number) => void;
}) {
    return (
        <li data-active={isActive ? true : undefined} className={playListItemRoot()}>
            <button
                type={"button"}
                className={css({
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    w: "full",
                    py: 3,
                    fontSize: "sm",
                    px: 4,
                    textAlign: "start",
                    cursor: "pointer",
                    minW: 0,
                })}
                onClick={() => onJump(index)}
            >
                {isActive ? (
                    isPlaying ? (
                        <MusicPlayingIcon />
                    ) : (
                        <IconPause className={css({ w: 4, h: 4 })} />
                    )
                ) : (
                    <div className={css({ w: 4, h: 4, pos: "relative" })}>
                        <div
                            className={css({
                                fontSize: "sm",
                                fontFamily: "roboto",
                                fontWeight: 600,
                                pos: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                                opacity: 0.5,
                            })}
                        >
                            {index + 1}
                        </div>
                    </div>
                )}
                <span className={css({ truncate: true })}>{data.title}</span>
            </button>
        </li>
    );
}

const PlaylistItem = memo(PlaylistItemRaw, (prevProps, nextProps) => {
    // 如果 isActive 不为 true，则无视 isPlaying 的更新
    if (!nextProps.isActive) {
        // console.log("无视 isPlaying 的更新");
        return prevProps.isActive === nextProps.isActive && prevProps.data === nextProps.data;
    }
    // console.log("正常更新");
    return (
        prevProps.isActive === nextProps.isActive &&
        prevProps.data === nextProps.data &&
        prevProps.isPlaying === nextProps.isPlaying
    );
});

function Playlist() {
    const { queue, current } = useQueue();
    const isPlaying = !useAudioPaused();

    const handleJump = useCallback(
        async (i: number) => {
            if (queue[i].id === current?.id) {
                toggle();
                return;
            }
            jump(i, { restorePlayState: true });
        },
        [queue, current],
    );

    return (
        <ul className={vstack({ gap: 1, alignItems: "stretch" })}>
            {queue.map((e, i) => {
                return (
                    <PlaylistItem
                        isActive={current?.id === e.id}
                        isPlaying={isPlaying}
                        data={e}
                        key={e.id}
                        index={i}
                        onJump={handleJump}
                    />
                );
            })}
        </ul>
    );
}

export default function Page() {
    return (
        <div className={center({ flexDirection: "column", justifyContent: "flex-start" })}>
            <div className={css({ w: "full", maxW: "container" })}>
                <div className={flex({ flexDirection: ["column", "row"], gap: [3, 3] })}>
                    <div
                        className={css({
                            w: ["full", 60],
                            flex: "none",
                            borderRight: ["none", "1px solid token(colors.bs-border)"],
                            pe: [0, 3],
                        })}
                    >
                        <div className={css({ pos: "sticky", top: [18, "4.75rem"] })}>
                            <Title />
                            <div className={vstack({ w: "full", alignItems: "stretch", gap: 0, mt: [4, 5] })}>
                                <button
                                    type={"button"}
                                    className={bsButton({ variant: "ghost", color: "plain" })}
                                    disabled
                                >
                                    <IconMobile />
                                    导出到 Bilisound 客户端
                                </button>
                                <button type={"button"} className={bsButton({ variant: "ghost", color: "plain" })}>
                                    <IconEdit />
                                    管理模式
                                </button>
                                <button type={"button"} className={bsButton({ variant: "ghost", color: "danger" })}>
                                    <IconTrash />
                                    清空列表
                                </button>
                            </div>
                        </div>
                    </div>
                    <hr
                        className={css({ border: 0, w: "full", h: "1px", bg: "bs-border", display: ["block", "none"] })}
                    />
                    <div className={css({ w: "full", flex: "auto", minW: 0 })}>
                        <Playlist />
                    </div>
                </div>
            </div>
        </div>
    );
}
