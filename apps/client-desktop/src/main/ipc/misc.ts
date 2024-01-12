import {
    app, BrowserWindow, ipcMain, Menu, MenuItemConstructorOptions, shell, clipboard,
} from "electron";
import { findWindowById } from "../utils";

export default function initMisc() {
    // 获取剪贴板文本内容
    ipcMain.on("readTextFromClipboard", (event) => {
        event.returnValue = clipboard.readText();
    });

    // 打开开发者工具
    ipcMain.on("openDevTools", (event) => {
        const window = findWindowById(event.sender.id);
        window?.webContents.openDevTools();
    });

    // 打开外部网站
    ipcMain.on("openExternal", (event, path: string) => {
        shell.openExternal(path);
    });

    // 请求显示右键菜单
    ipcMain.on("requestContextMenu", (event, menu: MenuItemConstructorOptions[]) => {
        const window = findWindowById(event.sender.id);
        if (menu.length > 0 && window) {
            const InputMenu = Menu.buildFromTemplate(menu);
            InputMenu.popup({
                window,
            });
        }
    });

    // 请求打开文件
    ipcMain.on("openFile", (event, path: string) => {
        shell.openPath(path);
    });

    // 请求在资源管理器展示文件
    ipcMain.on("showFile", (event, path: string) => {
        shell.showItemInFolder(path);
    });
}
