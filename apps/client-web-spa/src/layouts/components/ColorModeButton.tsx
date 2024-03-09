import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { center, flex } from "@/styled-system/patterns";
import { css } from "@/styled-system/css";
import { ReactComponent as IconAuto } from "@/icons/ic--round-auto-awesome.svg";
import { ReactComponent as IconDark } from "@/icons/fa-solid--sun.svg";
import { ReactComponent as IconLight } from "@/icons/fa-solid--moon.svg";

const menuItem = flex({
    w: "full",
    ps: 4,
    pe: 6,
    py: 2,
    lineHeight: 1.25,
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "sm",
    gap: 2,
    cursor: "pointer",
    transitionDuration: "fast",
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
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button
                    type={"button"}
                    aria-label={"Dark mode"}
                    className={center({
                        w: 12,
                        h: 12,
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
                    <svg
                        aria-hidden="true"
                        className={css({ w: 5, h: 5 })}
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                    >
                        <path
                            fill="currentColor"
                            d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"
                        ></path>
                    </svg>
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    className={flex({
                        py: 2,
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
                    <button type={"button"} className={menuItem}>
                        <IconLight className={css({ color: "primary.500" })} />
                        明亮
                    </button>
                    <button type={"button"} className={menuItem}>
                        <IconDark className={css({ color: "primary.500" })} />
                        暗黑
                    </button>
                    <button type={"button"} className={menuItem}>
                        <IconAuto className={css({ color: "primary.500" })} />
                        跟随系统
                    </button>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
