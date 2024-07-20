import { css } from "@styled-system/css";
import { center, flex, hstack } from "@styled-system/patterns";
import ColorModeButton from "@/layouts/components/ColorModeButton";
import { Link } from "@tanstack/react-router";
import IconPlaylist from "@/icons/flowbite--list-music-solid.svg?react";
import IconSettings from "@/icons/mingcute--settings-6-line.svg?react";

export default function Header() {
    const navButton = center({
        paddingX: 3,
        height: 10,
        borderRadius: "md",
        transitionDuration: "fast",
        _hover: {
            bg: "white/10",
        },
    });
    return (
        <header
            className={flex({
                pos: "sticky",
                top: 0,
                justifyContent: "center",
                px: 4,
                zIndex: 1,
                bg: {
                    base: "primary.500",
                    _dark: "neutral.900/75",
                },
                _dark: {
                    borderBottomColor: "neutral.700",
                    borderBottomWidth: 1,
                    backdropFilter: "auto",
                    backdropBlur: "lg",
                },
            })}
        >
            <div
                className={flex({
                    h: 14,
                    width: "container",
                    gap: 4,
                    alignItems: "center",
                })}
            >
                <h1 className={css({ flex: 0 })}>
                    <Link
                        to={"/"}
                        className={css({
                            color: "white",
                            fontSize: "lg",
                            fontWeight: 700,
                            textTransform: "uppercase",
                        })}
                    >
                        Bilisound
                    </Link>
                </h1>
                <ul
                    className={flex({
                        flex: 1,
                        gap: 1,
                        color: "white",
                        _dark: {
                            color: "white",
                        },
                        fontWeight: 700,
                        fontSize: "sm",
                    })}
                >
                    <li>
                        <Link to={"/"} className={navButton}>
                            首页
                        </Link>
                    </li>
                    <li>
                        <a href={"https://github.com/bilisound/client-mobile/releases/latest"} className={navButton}>
                            客户端
                        </a>
                    </li>
                </ul>
                <div className={hstack({ me: -2, gap: 0, flex: 0 })}>
                    <Link
                        className={center({
                            w: 10,
                            h: 10,
                            borderRadius: "full",
                            color: "white",
                            transitionDuration: "fast",
                            cursor: "pointer",
                            _hover: {
                                bg: "primary.50/10",
                            },
                            _active: {
                                bg: "primary.50/10",
                            },
                            display: ["flex", "none"],
                        })}
                        aria-label={"查看播放列表"}
                        to={"/queue"}
                    >
                        <IconPlaylist />
                    </Link>
                    <Link
                        className={center({
                            w: 10,
                            h: 10,
                            borderRadius: "full",
                            color: "white",
                            transitionDuration: "fast",
                            cursor: "pointer",
                            _hover: {
                                bg: "primary.50/10",
                            },
                            _active: {
                                bg: "primary.50/10",
                            },
                            display: "flex",
                        })}
                        aria-label={"设置"}
                        to={"/settings"}
                    >
                        <IconSettings />
                    </Link>
                    <ColorModeButton />
                </div>
            </div>
        </header>
    );
}
