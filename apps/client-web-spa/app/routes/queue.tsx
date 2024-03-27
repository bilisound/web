import { css, cva } from "@styled-system/css";
import { center, flex, vstack } from "@styled-system/patterns";
import { AudioQueueData, jump, replaceQueue, toggle, useQueue } from "@/utils/audio.client";
import { memo, useCallback, useEffect, useState } from "react";
import IconMobile from "@/icons/fa-solid--mobile-alt.svg?react";
import IconEdit from "@/icons/fa-solid--edit.svg?react";
import IconTrash from "@/icons/fa-solid--trash-alt.svg?react";
import { bsButton } from "@/components/recipes/button";
import * as Dialog from "@radix-ui/react-dialog";
import IconLoading from "@/icons/loading.svg?react";
import { postInternalTransferList } from "@/api/online";
import { PLAYLIST_EXPORT_PREFIX } from "@/constants/qr-code";
import { sendToast } from "@/utils/toast";
import QRCode from "qrcode";
import { useCountdown } from "usehooks-ts";
import { secondToTimestamp } from "@bilisound2/utils";
import { bsDialog } from "@/components/recipes/dialog";
import CurrentPlayingIcon from "@/components/CurrentPlayingIcon";
import { measureNumberWidth } from "@/utils/vendors/dom";

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
    data,
    index,
    onJump,
    numberWidth = 0,
}: {
    isActive: boolean;
    data: AudioQueueData;
    index: number;
    onJump: (index: number) => void;
    numberWidth?: number;
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
                    <span className={center()} style={{ width: `max(1rem, ${numberWidth}px)` }}>
                        <CurrentPlayingIcon />
                    </span>
                ) : (
                    <span
                        className={css({
                            h: 4,
                            fontSize: "sm",
                            fontFamily: "roboto",
                            fontWeight: 600,
                            opacity: 0.5,
                            display: "block",
                            textAlign: "center",
                        })}
                        style={{ width: `max(1rem, ${numberWidth}px)` }}
                    >
                        {index + 1}
                    </span>
                )}
                <span className={css({ truncate: true })}>{data.title}</span>
            </button>
        </li>
    );
}

const PlaylistItem = memo(PlaylistItemRaw, (prevProps, nextProps) => {
    return (
        prevProps.isActive === nextProps.isActive &&
        prevProps.data === nextProps.data &&
        prevProps.numberWidth === nextProps.numberWidth
    );
});

function Playlist() {
    const { queue, current } = useQueue();
    const numberWidth = measureNumberWidth(String(queue.length).length, {
        className: css({
            fontSize: "sm",
            fontFamily: "roboto",
            fontWeight: 600,
        }),
    });

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
                        numberWidth={numberWidth}
                    />
                );
            })}
        </ul>
    );
}

function ExportListButton() {
    const [open, setOpen] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [result, setResult] = useState("");
    const { queue } = useQueue();
    const [count, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
        countStart: 300,
        intervalMs: 1000,
    });

    const canvasRef = useCallback(
        (el: HTMLCanvasElement) => {
            if (!el) {
                return;
            }
            QRCode.toCanvas(
                el,
                result,
                {
                    margin: 3,
                },
                function (error) {
                    if (error) console.error(error);
                    console.log("success!");
                },
            );
        },
        [result],
    );

    const handleExport = useCallback(async () => {
        setExporting(true);
        try {
            const { data: result } = await postInternalTransferList(queue);
            setResult(PLAYLIST_EXPORT_PREFIX + result);
            setOpen(true);
            resetCountdown();
            startCountdown();
        } catch (e) {
            sendToast("操作失败：" + (e as any).message, {
                type: "error",
            });
            throw e;
        } finally {
            setExporting(false);
        }
    }, [queue]);

    useEffect(() => {
        if (!open) {
            stopCountdown();
        }
    }, [open]);

    useEffect(() => {
        if (count <= 0) {
            setOpen(false);
        }
    }, [count]);

    return (
        <>
            <button
                type={"button"}
                className={bsButton({ variant: "ghost", color: "plain" })}
                disabled={exporting}
                onClick={handleExport}
            >
                {exporting ? <IconLoading /> : <IconMobile />}
                导出到 Bilisound 客户端
            </button>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className={bsDialog().overlay} />
                    <Dialog.Content className={css(bsDialog.raw().content, { maxW: "md" })}>
                        <Dialog.Title className={bsDialog().title}>导出到 Bilisound 客户端</Dialog.Title>
                        <Dialog.Description className={bsDialog().description}>
                            <b>请使用 Bilisound 客户端</b>扫描以下二维码，以完成导入操作。
                        </Dialog.Description>
                        <div className={center({ pt: 6, flexDirection: "column", gap: 2 })}>
                            <canvas ref={canvasRef} className={css({ rounded: "xl", boxShadow: "lg" })}></canvas>
                            <p
                                className={css({
                                    fontSize: "sm",
                                    color: {
                                        base: "neutral.800",
                                        _dark: "neutral.200",
                                    },
                                })}
                            >
                                二维码将在{" "}
                                <span className={css({ color: "red.500", fontWeight: "bold", fontFamily: "roboto" })}>
                                    {secondToTimestamp(count, { showMillisecond: false })}
                                </span>{" "}
                                后失效
                            </p>
                        </div>
                        <div className={bsDialog().actionGroup}>
                            <Dialog.Close asChild>
                                <button className={bsButton({ color: "primary" })} aria-label="Close" type={"button"}>
                                    关闭
                                </button>
                            </Dialog.Close>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}

function ClearListButton() {
    const handleClear = useCallback(() => {
        replaceQueue([]);
        sendToast("播放队列清空成功", { type: "success" });
    }, []);

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button type={"button"} className={bsButton({ variant: "ghost", color: "danger" })}>
                    <IconTrash />
                    清空队列
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={bsDialog().overlay} />
                <Dialog.Content className={bsDialog().content}>
                    <Dialog.Title className={bsDialog().title}>清空列表</Dialog.Title>
                    <Dialog.Description className={bsDialog().description}>
                        确定要清空整个播放队列吗？此操作不可撤销。
                    </Dialog.Description>
                    <div className={bsDialog().actionGroup}>
                        <Dialog.Close asChild>
                            <button className={bsButton({ variant: "ghost", color: "plain" })} type={"button"}>
                                取消
                            </button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <button
                                className={bsButton({ color: "danger" })}
                                aria-label="Close"
                                type={"button"}
                                onClick={handleClear}
                            >
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
                            borderInlineEnd: ["none", "1px solid token(colors.bs-border)"],
                            pe: [0, 3],
                        })}
                    >
                        <div className={css({ pos: "sticky", top: [18, "4.75rem"] })}>
                            <Title />
                            <div className={vstack({ w: "full", alignItems: "stretch", gap: 0, mt: [4, 5] })}>
                                <ExportListButton />
                                {/*<button type={"button"} className={bsButton({ variant: "ghost", color: "plain" })}>
                                    <IconEdit />
                                    管理模式
                                </button>*/}
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
