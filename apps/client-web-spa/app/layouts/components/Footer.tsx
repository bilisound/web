import React from "react";

import version from "../../version.json";
import { css } from "@styled-system/css";
import { flex } from "@styled-system/patterns";

const Footer: React.FC = () => {
    return (
        <footer
            className={flex({
                marginTop: "auto",
                px: 4,
                pb: "env(safe-area-inset-bottom, 0)",
                color: {
                    base: "black",
                    _dark: "white",
                },
                borderTopColor: "bs-border",
                borderTopWidth: 1,
                justifyContent: "center",
                fontSize: "sm",
                // pos: "sticky",
                // bottom: 0,
                // backdropFilter: "auto",
                // backdropBlur: "lg",
                // bg: "white/75",
            })}
        >
            <div
                className={css({
                    w: "full",
                    maxW: "container",
                })}
            >
                <div
                    className={flex({
                        flexDirection: ["column", "column", "row"],
                        alignItems: ["flex-start", "flex-start", "center"],
                        justifyContent: "space-between",
                        opacity: 0.6,
                        lineHeight: 2,
                        py: 2,
                    })}
                >
                    <div>{`© 2012-${version.copyrightYear} Bilisound Team`}</div>
                    <div>
                        {`v${version.version} (${version.gitHash.slice(0, 8)}@${version.gitBranch})`}
                        {/* <Link as={RouterLink} to="/page/about">关于我们</Link>
                        &emsp;
                        <Link as={RouterLink} to="/page/open-source">开源软件使用声明</Link> */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
