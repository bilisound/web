import { BrowserWindow } from "electron";

export function findWindowById(id: number) {
    return BrowserWindow.getAllWindows().find(
        (win) => win.webContents.id === id,
    );
}
