import { center } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { useConfigStore } from "@/store/config.client";
import { bsCheckbox } from "@/components/recipes/checkbox";

export default function Page() {
    const { showYuruChara, setShowYuruChara, pauseWhenOpenExternal, setPauseWhenOpenExternal } = useConfigStore(
        state => ({
            showYuruChara: state.showYuruChara,
            setShowYuruChara: state.setShowYuruChara,
            pauseWhenOpenExternal: state.pauseWhenOpenExternal,
            setPauseWhenOpenExternal: state.setPauseWhenOpenExternal,
        }),
    );

    const checkbox = bsCheckbox();

    return (
        <div className={center({ alignItems: "flex-start" })}>
            <div className={css({ w: "full", maxW: "container" })}>
                <h2 className={css({ fontSize: "xl", fontWeight: 600, letterSpacing: "0.25em" })}>系统设置</h2>
                <hr className={css({ h: 0, border: 0, borderBottom: "2px dashed token(colors.bs-border)", my: 4 })} />
                <label className={css({ display: "flex", alignItems: "center", mb: "5", cursor: "pointer" })}>
                    <input
                        type="checkbox"
                        checked={showYuruChara}
                        className={`${checkbox.input} peer`}
                        onChange={() => setShowYuruChara(!showYuruChara)}
                    />
                    <div className={checkbox.display}></div>
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
                <label className={css({ display: "flex", alignItems: "center", mb: "5", cursor: "pointer" })}>
                    <input
                        type="checkbox"
                        checked={pauseWhenOpenExternal}
                        className={`${checkbox.input} peer`}
                        onChange={() => setPauseWhenOpenExternal(!pauseWhenOpenExternal)}
                    />
                    <div className={checkbox.display}></div>
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
                        点击「查看源视频」后暂停音频
                    </span>
                </label>
            </div>
        </div>
    );
}
