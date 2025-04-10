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
                    Bilisound 有与手机客户端功能基本一致的新 Web 版了！
                </div>
                <Link
                    to={"/notice"}
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
