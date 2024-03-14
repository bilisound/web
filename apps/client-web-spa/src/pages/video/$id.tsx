import { useParams } from "umi";
import { getBilisoundMetadata } from "@/api/online";
import { css } from "@/styled-system/css";
import { aspectRatio, circle, grid, hstack, vstack } from "@/styled-system/patterns";
import { getImageProxyUrl } from "@/utils/misc";
import { useQuery } from "@tanstack/react-query";

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
        <div className={vstack()}>
            <section className={grid({ columns: [1, 1, 2], gap: [4, 4, 6], w: "full", maxW: "container" })}>
                <div>
                    <div className={aspectRatio({ ratio: 16 / 9 })}>
                        <img
                            src={getImageProxyUrl(detail.pic, detail.bvid)}
                            alt={`${detail.title} 的封面图片`}
                            className={css({
                                borderRadius: "xl",
                                boxShadow: "lg",
                            })}
                        />
                    </div>
                </div>
                <div className={vstack({ alignItems: "stretch", gap: 4 })}>
                    <h2 className={css({ fontSize: "lg", fontWeight: 600, lineHeight: 1.5 })}>{detail.title}</h2>
                    <div className={hstack()}>
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
                            className={css({ flex: "none", fontSize: "sm", opacity: 0.6 })}
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
        </div>
    );
}
