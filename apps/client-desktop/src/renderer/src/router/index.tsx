import { createHashRouter, Navigate } from "react-router-dom";
import React from "react";
import ErrorView from "@/views/error";
import Root from "../layout/Root";

// https://github.com/microsoft/TypeScript/issues/42873
const router: any = createHashRouter([
    {
        path: "/",
        element: <Navigate to="/index" replace />,
    },
    {
        element: <Root />,
        errorElement: <ErrorView />,
        children: [
            {
                path: "/index",
                lazy: () => import("@/views/index"),
            },
            {
                path: "/video/:keyword",
                lazy: () => import("@/views/video"),
            },
            {
                path: "/settings",
                lazy: () => import("@/views/settings"),
            },
        ],
    },
    {
        path: "/*",
        element: <ErrorView />,
    },
]);

export default router;
