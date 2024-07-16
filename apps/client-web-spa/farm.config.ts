import { defineConfig } from "@farmfe/core";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import farmPluginPostcss from "@farmfe/js-plugin-postcss";
import svgr from "vite-plugin-svgr";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

export default defineConfig({
    compilation: {
        partialBundling: {},
        resolve: {
            alias: {
                "@/": path.join(fileURLToPath(import.meta.url), "../src"),
                "@styled-system/": path.join(fileURLToPath(import.meta.url), "../styled-system"),
            },
        },
        sourcemap: false,
    },
    server: {
        port: 5173,
    },
    plugins: ["@farmfe/plugin-react", "@farmfe/plugin-sass", farmPluginPostcss()],
    vitePlugins: [TanStackRouterVite(), svgr()],
});
