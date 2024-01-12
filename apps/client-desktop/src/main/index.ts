import {
    app, shell, BrowserWindow, Menu, MenuItemConstructorOptions,
} from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import initMisc from "./ipc/misc";
import initRequestHook from "./request-hook";
import initAria2 from "./aria2";
import initConfig from "./ipc/config";
import initHistory from "./ipc/history";
import initBrowser from "./ipc/browser";

function createWindow(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 660,
        minWidth: 800,
        minHeight: 450,
        show: false,
        titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "hidden",
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, "../preload/index.js"),
            sandbox: false,
        },
    });

    initRequestHook(mainWindow);

    mainWindow.on("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env.ELECTRON_RENDERER_URL) {
        mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
    } else {
        mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
    }

    // Create the Application's main menu
    if (app.isPackaged) {
        const template: Electron.MenuItemConstructorOptions[] = [
            ...(process.platform === "darwin" ? [{
                label: app.name,
                submenu: [
                    { role: "about" },
                    { type: "separator" },
                    { role: "services" },
                    { type: "separator" },
                    { role: "hide" },
                    { role: "hideOthers" },
                    { role: "unhide" },
                    { type: "separator" },
                    { role: "quit" },
                ],
            }] as MenuItemConstructorOptions[] : []),
            {
                label: "Edit",
                submenu: [
                    { role: "undo" },
                    { role: "redo" },
                    { type: "separator" },
                    { role: "cut" },
                    { role: "copy" },
                    { role: "paste" },
                    ...(process.platform === "darwin" ? [
                        { role: "pasteAndMatchStyle" },
                        { role: "delete" },
                        { role: "selectAll" },
                        { type: "separator" },
                        {
                            label: "Speech",
                            submenu: [
                                { role: "startSpeaking" },
                                { role: "stopSpeaking" },
                            ],
                        },
                    ] as MenuItemConstructorOptions[] : [
                        { role: "delete" },
                        { type: "separator" },
                        { role: "selectAll" },
                    ] as MenuItemConstructorOptions[]),
                ],
            },
        ];

        Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    }
}

app.whenReady().then(async () => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("moe.bilisound.client.desktop");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    initBrowser();
    initConfig();
    initHistory();
    initMisc();
    await initAria2();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    createWindow();
});

app.on("window-all-closed", () => {
    app.quit();
});
