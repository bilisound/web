import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import NProgress from "nprogress";
import "./assets/vendors/nprogress.css";
import "./root.css";

NProgress.configure({
    showSpinner: false,
});

// 初始化播放器实例
// 从浏览器的 localStorage 读取数据
const index = JSON.parse(globalThis?.localStorage?.[BILISOUND_QUEUE_INDEX] ?? "-1");
const queue = JSON.parse(globalThis?.localStorage?.[BILISOUND_DEFAULT_PLAYLIST] ?? "[]") as AudioQueueData[];
queue.forEach((e, i) => {
    e.key = `__initial_key_${i}`;
    e.url = `${BASE_URL}/api/internal/resource?id=${e.bvid}&episode=${e.episode}`;
});

const audioInstance = new BilisoundAudioService({
    queue,
    index,
});

audioInstance.addEventListener("queueUpdate", evt => {
    localStorage[BILISOUND_DEFAULT_PLAYLIST] = JSON.stringify(evt.detail);
});

audioInstance.addEventListener("indexUpdate", evt => {
    localStorage[BILISOUND_QUEUE_INDEX] = JSON.stringify(evt.detail);
});

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BilisoundAudioService from "@/utils/audio/instance";
import { BILISOUND_DEFAULT_PLAYLIST, BILISOUND_QUEUE_INDEX } from "@/constants/local-storage";
import { BASE_URL } from "@/constants";
import { AudioQueueData } from "@/utils/audio/types";
import { BilisoundAudioServiceProvider } from "@/utils/audio/react";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

// Create a client
const queryClient = new QueryClient();

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <BilisoundAudioServiceProvider instance={audioInstance}>
                    <RouterProvider router={router} />
                </BilisoundAudioServiceProvider>
            </QueryClientProvider>
        </StrictMode>,
    );
}
