import { css } from "@styled-system/css";

import React from "react";
import toast from "react-hot-toast";
import IconCheckMark from "@/icons/check-mark.svg?react";
import IconWarning from "@/icons/warning.svg?react";
import IconCross from "@/icons/cross.svg?react";
import type { SystemStyleObject } from "@styled-system/types";

export type ToastTypes = "success" | "warning" | "error" | "info";

interface ToastAppearance {
    icon: React.ReactNode;
    bg: SystemStyleObject;
}

// 需要写全称是为了让 Tailwind CSS 能够识别到
const kinds: Record<ToastTypes, ToastAppearance> = {
    success: {
        icon: <IconCheckMark className={css({ w: "4", h: "4" })} />,
        bg: css.raw({ bgColor: "green.500" }),
    },
    warning: {
        icon: <IconWarning className={css({ w: "6", h: "6" })} />,
        bg: css.raw({ bgColor: "orange.500" }),
    },
    error: {
        icon: <IconCross className={css({ w: "4", h: "4" })} />,
        bg: css.raw({ bgColor: "red.500" }),
    },
    info: {
        icon: (
            <IconWarning
                className={css({
                    w: "6",
                    h: "6",
                    transform: "rotate(180deg)",
                })}
            />
        ),
        bg: css.raw({ bgColor: "blue.500" }),
    },
};

export interface SendToastOptions {
    type?: ToastTypes;
    duration?: number;
}

export function sendToast(message: React.ReactNode | Error, options: SendToastOptions = {}) {
    const type = options.type ?? "info";
    const resolvedMessage = message instanceof Error ? message.message : message;

    toast.custom(
        t => (
            <div
                className={css({
                    bgColor: "white",
                    _dark: { bgColor: "neutral.800", borderColor: "neutral.700" },
                    shadow: "xl",
                    p: "3",
                    rounded: "1.5625rem",
                    borderWidth: "1px",
                    borderColor: "neutral.50",
                    display: "flex",
                    alignItems: "center",
                    minW: "0",
                    animation: t.visible ? "bsFadeinToast .2s ease-out" : "bsFadeoutToast .15s ease-in forwards",
                })}
            >
                <div
                    className={css(kinds[type].bg, {
                        mr: "3",
                        color: "white",
                        w: "6",
                        h: "6",
                        display: "flex",
                        flex: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        rounded: "full",
                    })}
                >
                    {kinds[type].icon}
                </div>
                <div
                    className={css({
                        flex: "auto",
                        fontSize: "sm",
                        lineHeight: "normal",
                        paddingInlineEnd: 2,
                        wordBreak: "break-all",
                        color: "black",
                        _dark: { color: "white" },
                    })}
                >
                    {resolvedMessage}
                </div>
            </div>
        ),
        {
            duration: options.duration ?? 5000,
        },
    );
}
