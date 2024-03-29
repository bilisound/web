import { useParams } from "@remix-run/react";
import { getBilisoundMetadata, GetBilisoundMetadataResponse } from "@/api/online";
import { css, cva } from "@styled-system/css";
import { center, circle, grid, hstack, vstack } from "@styled-system/patterns";
import { getImageProxyUrl } from "@/utils/misc";
import { useQuery } from "@tanstack/react-query";
import { secondToTimestamp } from "@bilisound2/utils";
import { memo, useCallback, useState } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { htmlDecode } from "@bilisound2/utils/dist/dom";
import IconDown from "@/icons/mingcute--down-fill.svg?react";
import IconExternal from "@/icons/fa-solid--external-link-alt.svg?react";
import { bsButton } from "@/components/recipes/button";
import { bsSkeleton } from "@/components/recipes/skeleton";
import { measureNumberWidth } from "@/utils/vendors/dom";
import CurrentPlayingIcon from "@/components/CurrentPlayingIcon";
import { useInstance, useStatus } from "@/utils/audio/react";
import BilisoundAudioService from "@/utils/audio/instance";
import { useConfigStore } from "@/store/config.client";

const skeletonLength = [
    0.3484095619198131, 0.5274406037172059, 0.5640563137468972, 0.9519480340267148, 0.23511593039367695,
    0.49321600131466314, 0.9896558221259788, 0.9373028785524258, 0.3650075569024289, 0.5108529554075676,
];

const episode = cva({
    base: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        textAlign: "start",
        py: 3,
        px: 4,
        borderRadius: "lg",
        w: "full",
        h: "full",
        fontSize: "sm",
        gap: 3,
        cursor: "pointer",
        _focus: {
            outline: "0.125rem solid",
            outlineColor: {
                base: "primary.500",
                _dark: "primary.900",
            },
        },
    },
    variants: {
        active: {
            true: {
                bg: {
                    base: "primary.700",
                },
                color: "white",
                boxShadow: "md",
            },
            false: {
                bg: {
                    base: "primary.900/5",
                    _dark: "primary.100/5",
                },
            },
        },
    },
    defaultVariants: {
        active: false,
    },
});

function Information({ detail }: { detail: GetBilisoundMetadataResponse }) {
    const [showDetail, setShowDetail] = useState(false);
    const instance = useInstance();
    const { pauseWhenOpenExternal } = useConfigStore(state => ({
        pauseWhenOpenExternal: state.pauseWhenOpenExternal,
    }));

    const detailParaRef = useCallback(
        (el: HTMLDivElement) => {
            if (el && !showDetail && el.getBoundingClientRect().height <= 224) {
                console.log(el.getBoundingClientRect());
                setShowDetail(true);
            }
        },
        [showDetail],
    );

    return (
        <section className={grid({ columns: [1, 1, 2], gap: [4, 4, 5], w: "full", maxW: "container" })}>
            <div>
                <img
                    src={getImageProxyUrl(detail.pic, detail.bvid)}
                    alt={`${detail.title} 的封面图片`}
                    className={css({
                        w: "full",
                        borderRadius: "xl",
                        boxShadow: "lg",
                        aspectRatio: "3/2",
                        objectPosition: "center",
                        objectFit: "cover",
                        pos: ["static", "sticky"],
                        top: "4.75rem",
                    })}
                />
            </div>
            <div className={vstack({ alignItems: "stretch", gap: 4 })}>
                {/* 标题 */}
                <h2 className={css({ fontSize: "lg", fontWeight: 600, lineHeight: 1.5 })}>{detail.title}</h2>

                {/* 作者信息、上传时间 */}
                <div className={hstack({ gap: 3 })}>
                    <Avatar.Root
                        className={circle({
                            w: 8,
                            h: 8,
                            flex: "none",
                            bg: "primary.500",
                            overflow: "hidden",
                        })}
                    >
                        <Avatar.Image
                            className={css({
                                w: "full",
                                h: "full",
                                objectFit: "cover",
                                objectPosition: "center",
                            })}
                            src={getImageProxyUrl(detail.owner.face, detail.bvid)}
                            alt={`${detail.owner.name} 的头像`}
                        />
                        <Avatar.Fallback
                            className={center({
                                w: "full",
                                h: "full",
                                fontSize: "md",
                                fontWeight: 600,
                                color: "white",
                            })}
                            delayMs={600}
                        >
                            {Array.from(detail.owner.name)[0]}
                        </Avatar.Fallback>
                    </Avatar.Root>
                    <div className={css({ flex: "auto", truncate: true, fontSize: "sm", fontWeight: 600 })}>
                        {detail.owner.name}
                    </div>
                    <time
                        className={css({ flex: "none", fontSize: "sm", opacity: 0.6, zIndex: -1 })}
                        dateTime={new Date(detail.pubDate).toISOString()}
                    >
                        {new Date(detail.pubDate).toLocaleDateString("zh-hans-CN")}
                    </time>
                </div>

                {/* 详情 */}
                <div className={css({ pos: "relative", overflow: "hidden", maxH: showDetail ? "inherit" : 56 })}>
                    <p
                        className={css({
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                            fontSize: "sm",
                            lineHeight: 1.5,
                        })}
                        ref={detailParaRef}
                    >
                        {htmlDecode(detail.desc)}
                    </p>
                    <button
                        type={"button"}
                        className={css({
                            display: showDetail ? "none" : "flex",
                            w: "full",
                            h: "full",
                            pos: "absolute",
                            left: 0,
                            top: 0,
                            flexDirection: "column",
                            alignItems: "stretch",
                            cursor: "pointer",
                        })}
                        onClick={() => setShowDetail(true)}
                    >
                        <span
                            className={css({
                                display: "block",
                                flex: "auto",
                            })}
                        ></span>
                        <span
                            className={center({
                                // bg: "blue.500/50",
                                flex: "none",
                                fontSize: "sm",
                                fontWeight: 600,
                                color: {
                                    base: "blue.600",
                                    _dark: "blue.500",
                                },
                                h: 16,
                                gradientTo: {
                                    base: "white",
                                    _dark: "neutral.900",
                                },
                                gradientFrom: "transparent",
                                bgGradient: "to-b",
                            })}
                        >
                            查看详情
                            <IconDown className={css({ w: 3, h: 3, ms: 1 })} />
                        </span>
                    </button>
                </div>

                {/* 操作 */}
                <div className={hstack({ gap: 2 })}>
                    <a
                        className={bsButton()}
                        href={`https://www.bilibili.com/video/${detail.bvid}`}
                        target={"_blank"}
                        rel="noreferrer"
                        onClick={() => {
                            if (pauseWhenOpenExternal) {
                                instance.pause();
                            }
                        }}
                    >
                        <IconExternal />
                        查看源视频
                    </a>
                </div>
            </div>
        </section>
    );
}

function EpisodeRaw({
    detail,
    isCurrent = false,
    onClick,
    numberWidth = 0,
}: {
    detail: GetBilisoundMetadataResponse["pages"][number];
    isCurrent?: boolean;
    onClick?: () => void;
    numberWidth?: number;
}) {
    return (
        <li>
            <button type="button" className={`group ${episode({ active: isCurrent })}`} onClick={onClick}>
                {isCurrent ? (
                    <span className={center()} style={{ width: `max(1rem, ${numberWidth}px)` }}>
                        <CurrentPlayingIcon />
                    </span>
                ) : (
                    <span
                        className={css({
                            fontSize: "md",
                            fontWeight: "bold",
                            flex: "none",
                            fontFamily: "roboto",
                            textAlign: "center",
                            display: "block",
                        })}
                        style={{ width: `max(1rem, ${numberWidth}px)` }}
                    >
                        {detail.page}
                    </span>
                )}
                <span
                    className={css({
                        truncate: true,
                        flex: "auto",
                        minW: 0,
                        px: 2,
                        textAlign: "left",
                        fontWeight: isCurrent ? 600 : 400,
                    })}
                >
                    {detail.part}
                </span>
                <span
                    className={css({
                        flex: "none",
                        fontWeight: "semibold",
                        fontFamily: "roboto",
                    })}
                >
                    {secondToTimestamp(detail.duration, { showHour: true, showMillisecond: false })}
                </span>
            </button>
        </li>
    );
}

const Episode = memo(EpisodeRaw, (a, b) => {
    return a.isCurrent === b.isCurrent && a.detail === b.detail;
});

async function handleTrackClick({
    detail,
    item,
    isCurrent,
    instance,
}: {
    detail: GetBilisoundMetadataResponse;
    item: GetBilisoundMetadataResponse["pages"][number];
    isCurrent: boolean;
    instance: BilisoundAudioService;
}) {
    if (isCurrent) {
        instance.toggle();
        return;
    }
    const found = instance.findFromQueue(detail.bvid, item.page);
    if (found >= 0) {
        instance.jump(found);
        await instance.play();
        return;
    }
    instance.pushQueue({
        author: detail.owner.name,
        bvid: detail.bvid,
        duration: item.duration,
        episode: item.page,
        title: item.part,
        imgUrl: detail.pic,
    });
    await instance.play();
}

function EpisodeList({ detail }: { detail: GetBilisoundMetadataResponse }) {
    const { current } = useStatus();
    const instance = useInstance();
    const numberWidth = measureNumberWidth(String(detail.pages.length).length, {
        className: css({
            fontSize: "md",
            fontWeight: "bold",
            flex: "none",
            fontFamily: "roboto",
        }),
    });

    return (
        <section className={css({ w: "full", maxW: "container" })}>
            <h3 className={css({ fontSize: "lg", fontWeight: 600 })}>{`视频选集 (${detail.pages.length})`}</h3>
            <ul className={grid({ columns: [1, 1, 2], gap: [3, 3, detail.pages.length === 1 ? 5 : 3], mt: 4 })}>
                {detail.pages.map(item => {
                    const isCurrent =
                        (current && current.bvid === detail.bvid && current.episode === item.page) || false;
                    return (
                        <Episode
                            key={item.page}
                            detail={item}
                            isCurrent={isCurrent}
                            numberWidth={numberWidth}
                            onClick={async () => {
                                await handleTrackClick({ detail, item, isCurrent, instance });
                            }}
                        />
                    );
                })}
            </ul>
        </section>
    );
}

function DataSkeleton() {
    return (
        <div className={css({ display: "contents" })} aria-hidden={true}>
            {/* 视频信息 */}
            <div className={grid({ columns: [1, 1, 2], gap: [4, 4, 5], w: "full", maxW: "container" })}>
                <div>
                    <div className={css(bsSkeleton.raw(), { aspectRatio: "3/2", w: "full", borderRadius: "xl" })}></div>
                </div>
                <div className={vstack({ alignItems: "stretch", gap: 4 })}>
                    <div className={center({ h: "calc(1.125rem * 1.5)" })}>
                        <div
                            className={css(bsSkeleton.raw({ variant: "circle" }), {
                                h: "1.125rem",
                                w: "full",
                            })}
                        ></div>
                    </div>
                    <div className={hstack({ gap: 3 })}>
                        <div className={css(bsSkeleton.raw({ variant: "circle" }), { w: 8, h: 8, flex: "none" })}></div>
                        <div className={css({ flex: "auto" })}>
                            <div
                                className={css(bsSkeleton.raw({ variant: "circle" }), {
                                    w: 24,
                                    h: "1.125rem",
                                })}
                            ></div>
                        </div>
                        <div
                            className={css(bsSkeleton.raw({ variant: "circle" }), {
                                w: 20,
                                h: "1.125rem",
                                flex: "none",
                            })}
                        ></div>
                    </div>
                    <div>
                        {skeletonLength.map((e, i) => {
                            return (
                                <div
                                    className={center({ h: "calc(0.875rem * 1.5)", justifyContent: "flex-start" })}
                                    key={i}
                                >
                                    <div
                                        className={css(bsSkeleton.raw({ variant: "circle" }), {
                                            h: "0.875rem",
                                        })}
                                        style={{ width: `${e * 100}%` }}
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                    <div className={css(bsSkeleton.raw(), { w: 32, h: 10, rounded: "md" })}></div>
                </div>
            </div>
            {/* 选集 */}
            <div className={css({ w: "full", maxW: "container" })}>
                {/* 1.125rem */}
                <div className={center({ h: "calc(1.125rem * 1.5)", justifyContent: "flex-start" })}>
                    <div
                        className={css(bsSkeleton.raw({ variant: "circle" }), {
                            w: 24,
                            h: "1.125rem",
                        })}
                    ></div>
                </div>
                <div className={grid({ columns: [1, 1, 2], gap: [3, 3, 5], mt: 4 })}>
                    <div
                        className={css(bsSkeleton.raw(), {
                            h: 12,
                            rounded: "lg",
                        })}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    const { id } = useParams<{
        id: string;
    }>();
    const { data, isLoading } = useQuery({
        queryKey: [id ?? ""],
        queryFn: () => {
            if (!id) {
                return;
            }
            return getBilisoundMetadata({ id });
        },
    });

    if (isLoading) {
        return (
            <div className={vstack({ gap: 6, pos: "relative" })}>
                <div className={css({ srOnly: true })}>页面正在加载，请稍候……</div>
                <DataSkeleton />
            </div>
        );
    }

    if (!data) {
        return <div>Data is not loaded</div>;
    }

    const detail = data.data;

    return (
        <div className={vstack({ gap: 6, pos: "relative" })}>
            <Information detail={detail} />
            <EpisodeList detail={detail} />
        </div>
    );
}
