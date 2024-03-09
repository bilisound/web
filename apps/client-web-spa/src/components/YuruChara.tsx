import React from "react";
import backgroundCorner from "@/assets/bg-corner.svg";
import { css } from "@/styled-system/css";

const YuruChara: React.FC = () => (
    <div
        aria-hidden
        style={{
            background: `url(${backgroundCorner})`,
        }}
        className={css({
            w: "250px",
            h: "250px",
            position: "fixed",
            right: 0,
            bottom: "150px",
            zIndex: 1,
            opacity: {
                base: 0.3,
                _dark: 0.2,
            },
            pointerEvents: "none",
            mixBlendMode: {
                base: "multiply",
                _dark: "lighten",
            },
        })}
    />
);
export default YuruChara;
