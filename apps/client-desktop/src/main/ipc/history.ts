import Store, { Schema } from "electron-store";
import { ipcMain } from "electron";
import { BilisoundDownloadItemDisplay } from "../../common";

interface HistoryRoot {
    data: BilisoundDownloadItemDisplay[]
}

export default function initHistory() {
    const schema: Schema<HistoryRoot> = {
        data: {
            default: [],
        },
    };

    const historyStore = new Store({
        schema,
        name: "download-history",
    });

    ipcMain.on("history.get", (event) => {
        event.returnValue = historyStore.get("data");
    });

    ipcMain.on("history.set", (event, value) => {
        historyStore.set("data", value);
        event.returnValue = undefined;
    });

    return historyStore;
}
