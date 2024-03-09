import React from "react";
import { css } from "@/styled-system/css";

export default () => (
    <div
        className={css({
            color: "red.500",
            _dark: {
                color: "green.500",
            },
        })}
    >
        Hello
    </div>
);
