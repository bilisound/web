import { Outlet } from "@tanstack/react-router";
import React from "react";
import Header from "@/layouts/components/Header";
import YuruChara from "@/components/YuruChara";
import { vstack } from "@styled-system/patterns";
import Footer from "@/layouts/components/Footer";
import { css } from "@styled-system/css";
import AudioPlayer from "@/layouts/components/AudioPlayer";

export default function WebLayout() {
    return (
        <div
            className={vstack({
                alignItems: "stretch",
                minH: "100dvh",
                gap: 0,
            })}
        >
            <Header />
            <main
                className={css({
                    flex: "auto",
                    px: 4,
                    py: [4, 4, 5],
                    display: "flex",
                    alignItems: "stretch",
                    "& > *": {
                        w: "full",
                    },
                })}
            >
                <Outlet />
            </main>
            <Footer />
            <AudioPlayer />
            <YuruChara />
        </div>
    );
}
