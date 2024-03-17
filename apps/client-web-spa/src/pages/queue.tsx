import { css } from "@/styled-system/css";
import { center, flex } from "@/styled-system/patterns";
import { AudioQueueData, jump, toggle, useAudioPaused, useQueue } from "@/utils/audio";
import { memo, useCallback } from "react";
import MusicPlayingIcon from "@/components/MusicPlayingIcon";
import { ReactComponent as IconPause } from "@/icons/fa-solid--pause.svg";

function Title() {
    const { queue } = useQueue();
    return (
        <h2
            className={css({
                fontSize: "xl",
                fontWeight: 600,
                lineHeight: 1.5,
                borderBottom: "2px dashed",
                borderColor: "bs-border",
                mb: 4,
                pb: 4,
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
        <li
            data-active={isActive ? true : undefined}
            className={css({
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
            })}
        >
            <button
                type={"button"}
                className={css({
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    w: "full",
                    py: 4,
                    ps: isActive ? 4 : 12,
                    pe: 4,
                    fontSize: "sm",
                    textAlign: "start",
                    cursor: "pointer",
                })}
                onClick={() => onJump(index)}
            >
                {isActive && (isPlaying ? <MusicPlayingIcon /> : <IconPause className={css({ w: 4, h: 4 })} />)}
                {data.title}
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
        <ul>
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
        <div className={center({ alignItems: "flex-start" })}>
            <div className={css({ w: "full", maxW: "container" })}>
                <Title />
                <div className={flex()}>
                    <div className={css({ w: 72, flex: "none" })}>左侧</div>
                    <div className={css({ w: "full", flex: "auto", minW: 0 })}>
                        <Playlist />
                    </div>
                </div>
            </div>
        </div>
    );
}
