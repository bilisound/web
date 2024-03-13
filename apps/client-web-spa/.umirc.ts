import {defineConfig} from "umi";

export default defineConfig({
    npmClient: 'pnpm',
    conventionRoutes: {
        exclude: [/\/components\//, /\/constants\//],
    },
    chainWebpack(config) {
        config.module.rule("mjscfg")
            .test(/\.m?js/)
            .resolve.set("fullySpecified", false)
    },
    jsMinifier: "swc",
    svgo: {
        plugins: [
            {
                name: 'preset-default',
                params: {
                    overrides: {
                        removeViewBox: false,
                    },
                },
            },
        ]
    },
    clientLoader: {},
    metas: [
        {
            "name": "renderer",
            "content": "webkit"
        },
        {
            "name": "viewport",
            "content": "width=device-width, initial-scale=1.0, viewport-fit=cover"
        },
        {
            "name": "theme-color",
            "content": "#00ba9d"
        },
        {
            "name": "apple-mobile-web-app-capable",
            "content": "yes"
        }
    ],
    headScripts: [
        {
            content: `
            // On page load or when changing themes, best to add inline in \`head\` to avoid FOUC
            if (localStorage.theme === 'dark' || ((!localStorage.theme || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }`
        }
    ],
    links: [
        {
            "href": "/resources/manifest.webmanifest",
            "rel": "manifest",
        },
        {
            "href": "/splash_screens/iPhone_14_Pro_Max_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/iPhone_14_Pro_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/iPhone_11__iPhone_XR_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/12.9__iPad_Pro_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/10.9__iPad_Air_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/10.5__iPad_Air_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/10.2__iPad_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/8.3__iPad_Mini_landscape.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        },
        {
            "href": "/splash_screens/iPhone_14_Pro_Max_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/iPhone_14_Pro_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/iPhone_11__iPhone_XR_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/12.9__iPad_Pro_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/10.9__iPad_Air_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/10.5__iPad_Air_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/10.2__iPad_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        },
        {
            "href": "/splash_screens/8.3__iPad_Mini_portrait.png",
            "rel": "apple-touch-startup-image",
            "media": "screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        },
        {
            "href": "/favicon.png",
            "rel": "icon",
        },
        {
            "href": "https://fonts.googleapis.com/",
            "rel": "preconnect",
        },
        {
            "href": "https://fonts.gstatic.com/",
            "rel": "preconnect",
        },
        {
            "href": "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
            "rel": "stylesheet",
        }
        ],
});
