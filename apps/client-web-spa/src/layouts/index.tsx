import { Outlet } from "umi";
import React from "react";
import Header from "@/layouts/components/Header";
import YuruChara from "@/components/YuruChara";
import { vstack } from "@/styled-system/patterns";
import Footer from "@/layouts/components/Footer";
import { css } from "@/styled-system/css";

export default function Layout() {
    return (
        <div
            className={vstack({
                alignItems: "stretch",
                minH: "100dvh",
                gap: [4, 4, 5],
            })}
        >
            <Header />
            <main
                className={css({
                    flex: "auto",
                    px: 4,
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
            <YuruChara />
        </div>
    );
}
