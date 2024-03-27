import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    plugins: [
        remix({
            ssr: false,
        }),
        tsconfigPaths(),
        svgr(),
    ],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8787",
                changeOrigin: true,
                headers: {
                    referer: "https://bilisound.moe",
                },
            },
        },
    },
});
