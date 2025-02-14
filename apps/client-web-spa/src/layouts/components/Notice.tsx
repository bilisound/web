import { css } from "@styled-system/css";
import { Link } from "@tanstack/react-router";

export default function Notice() {
    return (
        <div
            className={css({
                display: "flex",
                justifyContent: "center",
                px: 4,
                py: 2,
                fontSize: 14,
                backgroundColor: "yellow.400",
                color: "black",
            })}
        >
            <div
                className={css({
                    w: "full",
                    maxW: "container",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                })}
            >
                <div
                    className={css({
                        flex: "auto",
                    })}
                >
                    Bilisound 旧 Web 版<b>即将下线</b>，稍后将会上线与手机客户端功能基本一致的新版。
                </div>
                <Link
                    to={"/offline-notice"}
                    className={css({
                        flex: "none",
                        h: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 4,
                        backgroundColor: "white",
                        color: "primary.700",
                        fontWeight: 700,
                        rounded: "md",
                    })}
                >
                    了解详情
                </Link>
            </div>
        </div>
    );
}
