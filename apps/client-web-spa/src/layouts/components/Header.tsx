import { css } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";
import ColorModeButton from "@/layouts/components/ColorModeButton";

export default function Header() {
    return (
        <header
            className={flex({
                pos: "sticky",
                top: 0,
                justifyContent: "center",
                px: 4,
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
                <h1
                    className={css({
                        color: "white",
                        fontSize: "lg",
                        fontWeight: 700,
                        textTransform: "uppercase",
                    })}
                >
                    Bilisound
                </h1>
                <div className={css({ me: -2 })}>
                    <ColorModeButton />
                </div>
            </div>
        </header>
    );
}
