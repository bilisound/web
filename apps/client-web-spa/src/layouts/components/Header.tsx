import { css } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";
import ColorModeButton from "@/layouts/components/ColorModeButton";

export default function Header() {
    return (
        <header
            className={flex({
                justifyContent: "center",
                bg: {
                    base: "primary.500",
                    _dark: "neutral.900",
                },
                _dark: {
                    borderBottomColor: "neutral.700",
                    borderBottomWidth: 1,
                },
            })}
        >
            <div
                className={flex({
                    h: 16,
                    width: "container",
                    justifyContent: "space-between",
                    alignItems: "center",
                })}
            >
                <h1
                    className={css({
                        color: "white",
                        fontSize: "xl",
                        fontWeight: 700,
                        textTransform: "uppercase",
                    })}
                >
                    Bilisound
                </h1>
                <div>
                    <ColorModeButton />
                </div>
            </div>
        </header>
    );
}
