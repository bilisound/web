import { useParams } from "umi";
import { getBilisoundMetadata, GetBilisoundMetadataResponse } from "@/api/online";
import { css, cva } from "@/styled-system/css";
import { circle, grid, hstack, vstack } from "@/styled-system/patterns";
import { getImageProxyUrl } from "@/utils/misc";
import { useQuery } from "@tanstack/react-query";
import { secondToTimestamp } from "@bilisound2/utils";
import { memo } from "react";
import { play, pushQueue, useQueue } from "@/utils/audio";

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
        _focus: {
            outline: "0.125rem solid",
            outlineColor: "primary.500",
        },
    },
    variants: {
        active: {
            true: {
                bg: {
                    base: "primary.700",
                },
                color: "white",
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
    return (
        <section className={grid({ columns: [1, 1, 2], gap: [4, 4, 5], w: "full", maxW: "container" })}>
            <div>
                <img
                    src={getImageProxyUrl(detail.pic, detail.bvid)}
                    alt={`${detail.title} 的封面图片`}
                    className={css({
                        borderRadius: "xl",
                        boxShadow: "lg",
                        aspectRatio: "3/2",
                        objectPosition: "center",
                        objectFit: "cover",
                    })}
                />
            </div>
            <div className={vstack({ alignItems: "stretch", gap: 4 })}>
                <h2 className={css({ fontSize: "lg", fontWeight: 600, lineHeight: 1.5 })}>{detail.title}</h2>
                <div className={hstack({ gap: 3 })}>
                    <img
                        src={getImageProxyUrl(detail.owner.face, detail.bvid)}
                        alt={`${detail.owner.name} 的头像`}
                        className={circle({
                            w: 8,
                            h: 8,
                            objectFit: "cover",
                            objectPosition: "center",
                            flex: "none",
                        })}
                    />
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
                <p
                    className={css({
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        fontSize: "sm",
                        lineHeight: 1.5,
                    })}
                >
                    {detail.desc}
                </p>
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

function EpisodeList({ detail }: { detail: GetBilisoundMetadataResponse }) {
    const { current } = useQueue();

    return (
        <section className={css({ w: "full", maxW: "container" })}>
            <h3 className={css({ fontSize: "lg", fontWeight: 600 })}>{`视频选集 (${detail.pages.length})`}</h3>
            <ul className={grid({ columns: [1, 1, 2], gap: 3, mt: 4 })}>
                {detail.pages.map(e => {
                    return (
                        <Episode
                            key={e.page}
                            detail={e}
                            isCurrent={current && current.bvid === detail.bvid && current.episode === e.page}
                            onClick={async () => {
                                await pushQueue({
                                    author: detail.owner.name,
                                    bvid: detail.bvid,
                                    duration: e.duration,
                                    episode: e.page,
                                    id: Math.random() + "",
                                    title: e.part,
                                    url: `https://api.tuu.run/bilisound/resource?id=${detail.bvid}&episode=${e.page}`,
                                });
                                await play();
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
