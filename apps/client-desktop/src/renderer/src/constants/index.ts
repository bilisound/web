export const PRIMARY_COLOR = "bilisound";

export const APP_BRAND = "Bilisound";

export const APP_TITLE_SUFFIX = " - Bilisound";

export const DEFAULT_HEADERS: Record<string, string> = {
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin",
};

export const BOTTOM_HEIGHT = "90px";

export const TITLE_BAR_HEIGHT = "38px";

export const TOP_BAR_HEIGHT = "72px";

export const VIEWPORT_HEIGHT = `calc(100dvh - ${TITLE_BAR_HEIGHT})`;

export const VIEWPORT_HEIGHT_WITH_PLAYER = `calc(100dvh - ${TITLE_BAR_HEIGHT} - ${TOP_BAR_HEIGHT} - ${BOTTOM_HEIGHT})`;
