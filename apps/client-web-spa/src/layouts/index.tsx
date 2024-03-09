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
                gap: 4,
            })}
        >
            <Header />
            <div
                className={css({
                    flex: "auto",
                })}
            >
                <Outlet />
            </div>
            <Footer />
            <YuruChara />
        </div>
    );
}
