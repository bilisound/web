import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { center, flex } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import IconAuto from "@/icons/ic--round-auto-awesome.svg?react";
import IconDark from "@/icons/fa-solid--moon.svg?react";
import IconLight from "@/icons/fa-solid--sun.svg?react";
import useColorModeStore from "@/store/colorMode.client";

const menuItem = flex({
    w: "full",
    ps: 2,
    pe: 4,
    py: 2,
    lineHeight: 1.25,
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "sm",
    gap: 2,
    cursor: "pointer",
    transitionDuration: "fast",
    borderRadius: "md",
    _hover: {
        bg: "primary.950/5",
    },
    _dark: {
        color: "white",
        _hover: {
            bg: "primary.50/10",
        },
    },
});

export default function ColorModeButton() {
    const { actualColorMode, setColorMode } = useColorModeStore(state => ({
        actualColorMode: state.actualColorMode,
        setColorMode: state.setColorMode,
    }));

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button
                    type={"button"}
                    aria-label={"界面主题切换"}
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
                    {actualColorMode === "dark" ? (
                        <IconDark className={css({ w: 4, h: 4 })} />
                    ) : (
                        <IconLight className={css({ w: 4, h: 4 })} />
                    )}
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    className={flex({
                        zIndex: 1,
                        p: 1,
                        bg: "white",
                        _dark: {
                            bg: "neutral.800",
                        },
                        borderRadius: "md",
                        boxShadow: "lg",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        filter: "drop-shadow(0 0 1px rgba(0,0,0,0.1))",
                        animationDuration: "150ms",
                        '&[data-state="open"]': {
                            animationName: "bsFadeinBottom",
                        },
                        '&[data-state="closed"]': {
                            animationName: "bsFadeoutBottom",
                        },
                    })}
                    sideOffset={5}
                >
                    <button type={"button"} className={menuItem} onClick={() => setColorMode("light")}>
                        <IconLight className={css({ color: "primary.500" })} />
                        明亮
                    </button>
                    <button type={"button"} className={menuItem} onClick={() => setColorMode("dark")}>
                        <IconDark className={css({ color: "primary.500" })} />
                        暗黑
                    </button>
                    <button type={"button"} className={menuItem} onClick={() => setColorMode("system")}>
                        <IconAuto className={css({ color: "primary.500" })} />
                        跟随系统
                    </button>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
