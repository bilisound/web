import React from "react";
import "animate.css";
import "./root.css";

export const rootContainer = (container: React.ReactNode) => (
    <React.StrictMode>
        {container}
    </React.StrictMode>
);
