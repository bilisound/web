import { css } from "@styled-system/css";
import { center, flex, hstack } from "@styled-system/patterns";
import ColorModeButton from "@/layouts/components/ColorModeButton";
import { Link } from "@tanstack/react-router";
import IconPlaylist from "@/icons/flowbite--list-music-solid.svg?react";
import IconSettings from "@/icons/mingcute--settings-6-line.svg?react";
import IconMenu from "@/icons/mingcute--menu-fill.svg?react";
import IconClose from "@/icons/mingcute--close-fill.svg?react";
import IconHome from "@/icons/fa-solid--home.svg?react";
import IconAndroid from "@/icons/mingcute--android-2-fill.svg?react";
import * as Dialog from "@radix-ui/react-dialog";
import { bsDialog } from "@/components/recipes/dialog";
import { useState } from "react";

const navButton = center({
    paddingX: 3,
    height: 10,
    borderRadius: "md",
    transitionDuration: "fast",
    _hover: {
        bg: "white/10",
    },
});

const navButtonMobile = flex({
    paddingX: 3,
    height: 10,
    alignItems: "center",
    gap: 3,
    borderRadius: "md",
    transitionDuration: "fast",
    _hover: {
        bg: "white/10",
    },
});

const dialogContent = css({
    bg: {
        base: "primary.500",
        _dark: "neutral.900/75",
    },
    _dark: {
        backdropFilter: "auto",
        backdropBlur: "lg",
    },
    position: "fixed",
    right: 0,
    top: 0,
    height: "100dvh",
    w: 60,
    zIndex: 10,
    animationDuration: "300ms",
    '&[data-state="open"]': {
        animationName: "bsDrawerOpen",
    },
    '&[data-state="closed"]': {
        animationName: "bsDrawerClose",
    },
});

export default function Header() {
    const [dialogOpen, setDialogOpen] = useState(false);

    const drawerMenu = (
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
            <Dialog.Trigger
                aria-label={"打开菜单"}
                className={center({
                    display: ["flex", "none"],
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
                })}
            >
                <IconMenu />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={bsDialog().overlay} />
                <Dialog.Content className={dialogContent}>
                    <Dialog.Title className={css({ srOnly: true })}>导航菜单</Dialog.Title>
                    <Dialog.Description className={css({ srOnly: true })}>
                        前往 Bilisound 各个部分的传送门
                    </Dialog.Description>
                    <div
                        className={css({
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            h: 14,
                            px: 2,
                        })}
                    >
                        <Dialog.Close
                            aria-label={"关闭菜单"}
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
                            })}
                        >
                            <IconClose />
                        </Dialog.Close>
                    </div>
                    <ul
                        className={flex({
                            color: "white",
                            fontWeight: 700,
                            fontSize: "sm",
                            flexDirection: "column",
                            alignItems: "stretch",
                            gap: 0,
                            px: 3,
                        })}
                    >
                        <li>
                            <Link to={"/"} className={navButtonMobile} onClick={() => setDialogOpen(false)}>
                                <IconHome className={css({ w: 4, h: 4 })} />
                                首页
                            </Link>
                        </li>
                        <li>
                            <Link to={"/queue"} className={navButtonMobile} onClick={() => setDialogOpen(false)}>
                                <IconPlaylist className={css({ w: 4, h: 4 })} />
                                正在播放
                            </Link>
                        </li>
                        <li>
                            <Link to={"/settings"} className={navButtonMobile} onClick={() => setDialogOpen(false)}>
                                <IconSettings className={css({ w: 4, h: 4 })} />
                                设置
                            </Link>
                        </li>
                        <li>
                            <a
                                href={"https://github.com/bilisound/client-mobile/releases/latest"}
                                target={"_blank"}
                                className={navButtonMobile}
                                onClick={() => setDialogOpen(false)}
                                rel="noreferrer"
                            >
                                <IconAndroid className={css({ w: 4, h: 4 })} />
                                客户端
                            </a>
                        </li>
                    </ul>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );

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
                    justifyContent: ["space-between"],
                    alignItems: "center",
                    position: "relative",
                })}
            >
                <h1>
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
                    className={css({
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        gap: 1,
                        color: "white",
                        _dark: {
                            color: "white",
                        },
                        fontWeight: 700,
                        fontSize: "sm",
                        display: ["none", "flex"],
                    })}
                >
                    <li>
                        <Link to={"/"} className={navButton}>
                            首页
                        </Link>
                    </li>
                    <li>
                        <a
                            href={"https://github.com/bilisound/client-mobile/releases/latest"}
                            target={"_blank"}
                            className={navButton}
                            rel="noreferrer"
                        >
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
                            display: ["none", "flex"],
                        })}
                        aria-label={"设置"}
                        to={"/settings"}
                    >
                        <IconSettings />
                    </Link>
                    <ColorModeButton />

                    {/* 抽屉菜单 */}
                    {drawerMenu}
                </div>
            </div>
        </header>
    );
}
