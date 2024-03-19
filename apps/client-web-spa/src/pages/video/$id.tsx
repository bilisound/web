import { useParams } from "umi";
import { getBilisoundMetadata, GetBilisoundMetadataResponse } from "@/api/online";
import { css, cva } from "@/styled-system/css";
import { center, circle, grid, hstack, vstack } from "@/styled-system/patterns";
import { getImageProxyUrl } from "@/utils/misc";
import { useQuery } from "@tanstack/react-query";
import { secondToTimestamp } from "@bilisound2/utils";
import { memo, useState } from "react";
import { findFromQueue, jump, play, pushQueue, toggle, useQueue } from "@/utils/audio";
import * as Avatar from "@radix-ui/react-avatar";
import { htmlDecode } from "@bilisound2/utils/dist/dom";
import { ReactComponent as IconDown } from "@/icons/mingcute--down-fill.svg";
import { BASE_URL } from "@/constants";

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
                <h2 className={css({ fontSize: "lg", fontWeight: 600, lineHeight: 1.5 })}>{detail.title}</h2>
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
                <div className={css({ pos: "relative" })}>
                    <p
                        className={css({
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                            fontSize: "sm",
                            lineHeight: 1.5,
                            overflow: "hidden",
                            h: showDetail ? "inherit" : 56,
                        })}
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
            </div>
        </section>
    );
}

function EpisodeRaw({
    detail,
    isCurrent = false,
    onClick,
}: {
    detail: GetBilisoundMetadataResponse["pages"][number];
    isCurrent?: boolean;
    onClick?: () => void;
}) {
    return (
        <li>
            <button type="button" className={`group ${episode({ active: isCurrent })}`} onClick={onClick}>
                <span
                    className={css({
                        fontSize: "md",
                        fontWeight: "bold",
                        flex: "none",
                        fontFamily: "roboto",
                    })}
                >
                    {detail.page}
                </span>
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
}: {
    detail: GetBilisoundMetadataResponse;
    item: GetBilisoundMetadataResponse["pages"][number];
    isCurrent: boolean;
}) {
    if (isCurrent) {
        toggle();
        return;
    }
    const found = findFromQueue(detail.bvid, item.page);
    if (found >= 0) {
        jump(found);
        await play();
        return;
    }
    await pushQueue({
        author: detail.owner.name,
        bvid: detail.bvid,
        duration: item.duration,
        episode: item.page,
        title: item.part,
        url: `${BASE_URL}/api/internal/resource?id=${detail.bvid}&episode=${item.page}`,
        imgUrl: detail.pic,
    });
    await play();
}

function EpisodeList({ detail }: { detail: GetBilisoundMetadataResponse }) {
    const { current } = useQueue();

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
                            onClick={async () => {
                                await handleTrackClick({ detail, item, isCurrent });
                            }}
                        />
                    );
                })}
            </ul>
        </section>
    );
}

export default function Page() {
    const { id } = useParams<{
        id: string;
    }>();
    const { data, isLoading } = useQuery({
        queryKey: [id ?? ""],
        queryFn: async () => {
            if (!id) {
                return;
            }
            return getBilisoundMetadata({ id }, true);
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>Data is not loaded</div>;
    }

    const detail = data.data;

    return (
        <div className={vstack({ gap: 6 })}>
            <Information detail={detail} />
            <EpisodeList detail={detail} />
        </div>
    );
}
