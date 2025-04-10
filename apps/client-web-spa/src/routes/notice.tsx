import { createFileRoute } from "@tanstack/react-router";
import { css } from "@styled-system/css";
import { center } from "@styled-system/patterns";
import { prose } from "@styled-system/recipes";
import { bsButton } from "@/components/recipes/button";
import { handleExport } from "@/utils/export";

export const Route = createFileRoute("/notice")({
    component: Page,
});

function Page() {
    return (
        <div className={center({ alignItems: "flex-start" })}>
            <div className={css({ w: "full", maxW: "container" })}>
                <div className={prose()} style={{ maxWidth: "unset" }}>
                    <h2 className={css({ mt: 2 })}>Bilisound Web 版更新计划</h2>
                    <p>2023 年 6 月，我们复活了沉寂已久的 Bilisound 项目，上线了 Web 版本，开启了新的篇章。</p>
                    <p>
                        如今，我们上线了 <a href={"https://app.bilisound.com"}>新的 Web 版</a>，
                        <b>旧版本将会进入维护模式，</b>不再添加任何新功能。
                    </p>
                    <p>
                        您可以随时导出 Web 版的播放队列到 Bilisound 客户端，或者点击下面的按钮导出可供 Bilisound
                        客户端导入的歌单文件：
                    </p>
                    <button className={bsButton({ color: "primary" })} type={"button"} onClick={() => handleExport()}>
                        导出播放队列为歌单文件
                    </button>
                    <h3>新的 Web 版有哪些不同？</h3>
                    <p>
                        新的 Web 版与手机客户端采用了同一套代码。得益于 React Native 的跨平台特性，我们将可以为 Web
                        版带来许多此前在手机客户端才有的功能，包括歌单、订阅播放列表，以及更加高级的音乐播放器功能。
                    </p>
                    <p>
                        尽管我们推荐您在条件允许的情况下使用手机客户端，但 Web
                        端可以满足轻度用户的使用需求，同时可以覆盖其它操作系统，所以未来我们会同等重视手机客户端和 Web
                        版。
                    </p>
                </div>
            </div>
        </div>
    );
}
