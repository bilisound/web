// MediaQueryList
import { create } from "zustand";

function normalizedDict() {
    if (localStorage.theme !== "dark" && localStorage.theme !== "light" && localStorage.theme !== "system") {
        localStorage.theme = "system";
    }
    return localStorage.theme;
}

function normalizedDictActual() {
    const raw = normalizedDict();
    if (raw === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return raw;
}

export type ActualColorMode = "dark" | "light";
export type ColorMode = "dark" | "light" | "system";

export interface ColorModeStoreProps {
    colorMode: ColorMode;
    actualColorMode: ActualColorMode;
}

export interface ColorModeStoreMethods {
    setColorMode: (colorMode: ColorMode) => void;
    setActualColorMode: (actualColorMode: ActualColorMode) => void;
}

const useColorModeStore = create<ColorModeStoreProps & ColorModeStoreMethods>()(setState => ({
    colorMode: normalizedDict(),
    setColorMode: colorMode => {
        switch (colorMode) {
            case "dark":
                document.documentElement.classList.add("dark");
                setState(() => ({ actualColorMode: "dark" }));
                break;
            case "light":
                document.documentElement.classList.remove("dark");
                setState(() => ({ actualColorMode: "light" }));
                break;
            default:
                if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    document.documentElement.classList.add("dark");
                    setState(() => ({ actualColorMode: "dark" }));
                } else {
                    document.documentElement.classList.remove("dark");
                    setState(() => ({ actualColorMode: "light" }));
                }
                break;
        }
        localStorage.theme = colorMode;
        setState(() => ({ colorMode }));
    },
    actualColorMode: normalizedDictActual(),
    setActualColorMode: actualColorMode => {
        setState(() => ({ actualColorMode }));
    },
}));

const activateDarkMode = (dark: boolean) => {
    const state = useColorModeStore.getState();
    if (state.colorMode !== "system") {
        return;
    }
    if (dark) {
        document.documentElement.classList.add("dark");
        state.setActualColorMode("dark");
    } else {
        document.documentElement.classList.remove("dark");
        state.setActualColorMode("light");
    }
};

const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");

darkModePreference.addEventListener("change", e => {
    activateDarkMode(e.matches);
});

export default useColorModeStore;
