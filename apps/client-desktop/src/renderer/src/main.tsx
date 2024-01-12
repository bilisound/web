import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import KonamiCode from "konami-code";
import { Buffer } from "buffer";
import { shallow } from "zustand/shallow";
import YuruChara from "./components/YuruChara";
import router from "./router";

import "./context-menu";

import "animate.css";
import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import "@/assets/index.css";
import getTheme, { ThemeName } from "./theme";
import { useConfigStore } from "./store/configStore";

window.Buffer = Buffer;

const Document: React.FC = () => {
    const {
        theme,
    } = useConfigStore((state) => ({
        theme: state.theme,
    }), shallow);

    return (
        <ChakraProvider
            toastOptions={{
                defaultOptions: {
                    isClosable: true,
                    position: "top-right",
                },
            }}
            theme={getTheme((theme || "defaultTheme") as ThemeName)}
        >
            <RouterProvider router={router} />
            <YuruChara />
        </ChakraProvider>
    );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Document />
    </React.StrictMode>,
);

const handler = new KonamiCode().listen(() => {
    window.electron.ipcRenderer.send("openDevTools");
});

// eslint-disable-next-line no-underscore-dangle
handler._delay = 500;
