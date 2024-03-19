import { css, cva } from "@/styled-system/css";
import { center, flex, hstack, vstack } from "@/styled-system/patterns";
import { AudioQueueData, jump, toggle, useAudioPaused, useQueue } from "@/utils/audio";
import { memo, useCallback, useState } from "react";
import MusicPlayingIcon from "@/components/MusicPlayingIcon";
import { ReactComponent as IconPause } from "@/icons/fa-solid--pause.svg";
import { ReactComponent as IconMobile } from "@/icons/fa-solid--mobile-alt.svg";
import { ReactComponent as IconEdit } from "@/icons/fa-solid--edit.svg";
import { ReactComponent as IconTrash } from "@/icons/fa-solid--trash-alt.svg";
import { bsButton } from "@/components/recipes/button";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactComponent as IconLoading } from "@/icons/loading.svg";
import sleep from "sleep-promise";

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

function PlaylistItemCurrentIcon() {
    const isPlaying = !useAudioPaused();

    if (isPlaying) {
        return <MusicPlayingIcon />;
    } else {
        return <IconPause className={css({ w: 4, h: 4 })} />;
    }
}

function PlaylistItemRaw({
    isActive,
    data,
    index,
    onJump,
}: {
    isActive: boolean;
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
                    <PlaylistItemCurrentIcon />
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
    return prevProps.isActive === nextProps.isActive && prevProps.data === nextProps.data;
});

function Playlist() {
    const { queue, current } = useQueue();

    const handleJump = useCallback(
        async (i: number) => {
            if (queue[i].key === current?.key) {
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
                        isActive={current?.key === e.key}
                        data={e}
                        key={e.key}
                        index={i}
                        onJump={handleJump}
                    />
                );
            })}
        </ul>
    );
}

function ExportListButton() {
    const [exporting, setExporting] = useState(false);

    const handleExport = useCallback(async () => {
        setExporting(true);
        await sleep(5000);
        setExporting(false);
    }, []);

    return (
        <button
            type={"button"}
            className={bsButton({ variant: "ghost", color: "plain" })}
            disabled={exporting}
            onClick={handleExport}
        >
            {exporting ? <IconLoading /> : <IconMobile />}
            导出到 Bilisound 客户端
        </button>
    );
}

function ClearListButton() {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button type={"button"} className={bsButton({ variant: "ghost", color: "danger" })}>
                    <IconTrash />
                    清空列表
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay
                    className={css({
                        bg: "black/60",
                        pos: "fixed",
                        inset: 0,
                        animationDuration: "300ms",
                        zIndex: 1,
                        '&[data-state="open"]': {
                            animationName: "bsFadein",
                        },
                        '&[data-state="closed"]': {
                            animationName: "bsFadeout",
                        },
                    })}
                />
                <Dialog.Content
                    className={css({
                        bg: {
                            base: "white",
                            _dark: "neutral.900",
                        },
                        p: 6,
                        rounded: "2xl",
                        animationDuration: "300ms",
                        pos: "fixed",
                        left: "50%",
                        top: "50%",
                        w: "calc(100% - 2rem)",
                        maxW: "sm",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1,
                        shadow: "2xl",
                        '&[data-state="open"]': {
                            animationName: "bsFadeinDialog",
                        },
                        '&[data-state="closed"]': {
                            animationName: "bsFadeoutDialog",
                        },
                    })}
                >
                    <Dialog.Title className={css({ fontSize: "lg", lineHeight: 1.5, fontWeight: 600 })}>
                        清空列表
                    </Dialog.Title>
                    <Dialog.Description className={css({ mt: 2, fontSize: "sm", lineHeight: 1.5 })}>
                        确定要清空整个播放队列吗？此操作不可撤销。
                    </Dialog.Description>
                    <div className={hstack({ justifyContent: "flex-end", gap: 2, mt: 6 })}>
                        <Dialog.Close asChild>
                            <button className={bsButton({ variant: "ghost", color: "plain" })} type={"button"}>
                                取消
                            </button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <button className={bsButton({ color: "danger" })} aria-label="Close" type={"button"}>
                                确定
                            </button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
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
                                <ExportListButton />
                                <button type={"button"} className={bsButton({ variant: "ghost", color: "plain" })}>
                                    <IconEdit />
                                    管理模式
                                </button>
                                <ClearListButton />
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
