import { css } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";
import ColorModeButton from "@/layouts/components/ColorModeButton";
import { Link } from "umi";

export default function Header() {
    return (
        <header
            className={flex({
                pos: "sticky",
                top: 0,
                justifyContent: "center",
                px: 4,
                zIndex: 1,
                bg: {
                    base: "primary.500",
                    _dark: "neutral.900/75",
                },
                _dark: {
                    borderBottomColor: "neutral.700",
                    borderBottomWidth: 1,
                    backdropFilter: "auto",
                    backdropBlur: "lg",
                },
            })}
        >
            <div
                className={flex({
                    h: 14,
                    width: "container",
                    justifyContent: "space-between",
                    alignItems: "center",
                })}
            >
                <h1>
                    <Link
                        to={"/"}
                        className={css({
                            color: "white",
                            fontSize: "lg",
                            fontWeight: 700,
                            textTransform: "uppercase",
                        })}
                    >
                        Bilisound
                    </Link>
                </h1>
                <div className={css({ me: -2 })}>
                    <ColorModeButton />
                </div>
            </div>
        </header>
    );
}
