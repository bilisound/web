import { center } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { useConfigStore } from "@/store/config.client";

export default function Page() {
    const { showYuruChara, setShowYuruChara } = useConfigStore(state => ({
        showYuruChara: state.showYuruChara,
        setShowYuruChara: state.setShowYuruChara,
    }));

    return (
        <div className={center({ alignItems: "flex-start" })}>
            <div className={css({ w: "full", maxW: "container" })}>
                <h2 className={css({ fontSize: "xl", fontWeight: 600, letterSpacing: "0.25em" })}>系统设置</h2>
                <hr className={css({ h: 0, border: 0, borderBottom: "2px dashed token(colors.bs-border)", my: 4 })} />
                <label className={css({ display: "inline-flex", alignItems: "center", mb: "5", cursor: "pointer" })}>
                    <input
                        type="checkbox"
                        checked={showYuruChara}
                        className={`${css({
                            srOnly: true,
                        })} peer`}
                        onChange={() => setShowYuruChara(!showYuruChara)}
                    />
                    <div
                        className={css({
                            pos: "relative",
                            w: "11",
                            h: "6",
                            bgColor: "neutral.200",
                            _peerFocus: { ring: "none", ringOffset: "none", shadow: "4" },
                            rounded: "full",
                            _dark: { bgColor: "neutral.700", borderColor: "neutral.600" },
                            _after: {
                                _peerChecked: {
                                    content: "''",
                                    transform: "translateX(100%)",
                                    _rtl: {
                                        content: "''",
                                        transform: "translateX(-100%)",
                                    },
                                    borderColor: "white",
                                },
                                content: "''",
                                pos: "absolute",
                                top: "2px",
                                insetInlineStart: "2px",
                                bgColor: "white",
                                borderColor: "neutral.300",
                                borderWidth: "1px",
                                rounded: "full",
                                w: "5",
                                h: "5",
                                transitionDuration: "slow",
                            },
                            _peerChecked: { bgColor: "primary.600" },
                        })}
                    ></div>
                    <span
                        className={css({
                            marginInlineStart: "3",
                            fontSize: "sm",
                            lineHeight: "sm",
                            fontWeight: "medium",
                            color: "neutral.900",
                            _dark: { color: "neutral.300" },
                        })}
                    >
                        显示看板娘
                    </span>
                </label>
            </div>
        </div>
    );
}
