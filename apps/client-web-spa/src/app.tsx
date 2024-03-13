import React from "react";
import "./root.css";
import { Toaster } from "react-hot-toast";

export const rootContainer = (container: React.ReactNode) => (
    <React.StrictMode>
        {container}
        <Toaster />
    </React.StrictMode>
);
