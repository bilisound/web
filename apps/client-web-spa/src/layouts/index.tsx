import { Outlet } from "umi";
import React from "react";
import Header from "@/layouts/components/Header";
import YuruChara from "@/components/YuruChara";

export default function Layout() {
    return (
        <div>
            <Header />
            <Outlet />
            <YuruChara />
        </div>
    );
}
