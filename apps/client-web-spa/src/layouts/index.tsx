import { Outlet } from "umi";
import React from "react";
import Header from "@/layouts/components/Header";

export default function Layout() {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
}
