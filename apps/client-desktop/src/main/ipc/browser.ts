import { app, ipcMain } from "electron";
import { findWindowById } from "../utils";

export default function initBrowser() {
    // 是否可以后退
    ipcMain.on("browser.canGoBack", (event) => {
        const window = findWindowById(event.sender.id);
        event.returnValue = window?.webContents.canGoBack();
    });

    // 是否可以前进
    ipcMain.on("browser.canGoForward", (event) => {
        const window = findWindowById(event.sender.id);
        event.returnValue = window?.webContents.canGoForward();
    });

    // 后退
    ipcMain.on("browser.goBack", (event) => {
        const window = findWindowById(event.sender.id);
        window?.webContents.goBack();
        event.returnValue = undefined;
    });

    // 前进
    ipcMain.on("browser.goForward", (event) => {
        const window = findWindowById(event.sender.id);
        window?.webContents.goForward();
        event.returnValue = undefined;
    });

    // 最小化
    ipcMain.on("browser.minimize", (event) => {
        const window = findWindowById(event.sender.id);
        window?.minimize();
    });

    // 关闭
    ipcMain.on("browser.quit", (event) => {
        app.quit();
    });
}
