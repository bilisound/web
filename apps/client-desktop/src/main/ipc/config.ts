import Store, { Schema } from "electron-store";
import { app, ipcMain, dialog } from "electron";
import { BilisoundConfig } from "../../common";

export default function initConfig() {
    const schema: Schema<BilisoundConfig> = {
        downloadPath: {
            default: app.getPath("downloads"),
        },
        muted: {
            default: false,
        },
        autoPlay: {
            default: true,
        },
        instantSave: {
            default: true,
        },
        useAv: {
            default: false,
        },
        theme: {
            default: "defaultTheme",
        },
    };

    const configStore = new Store({
        schema,
        encryptionKey: "not-super-secret-string",
        fileExtension: "bin",
    });

    ipcMain.on("config.getAll", (event, key) => {
        event.returnValue = configStore.store;
    });

    ipcMain.on("config.get", (event, key) => {
        event.returnValue = configStore.get(key);
    });

    ipcMain.on("config.set", (event, key, value) => {
        configStore.set(key, value);
        event.returnValue = undefined;
    });

    ipcMain.on("config.clear", (event) => {
        configStore.clear();
        event.returnValue = undefined;
    });

    ipcMain.on("config.changeDownloadPath", async (event) => {
        const path = await dialog.showOpenDialog({
            properties: ["openDirectory"],
        });
        if (!path.canceled) {
            event.sender.send("config.changeDownloadPathCallback", path.filePaths[0]);
        }
    });

    return configStore;
}
