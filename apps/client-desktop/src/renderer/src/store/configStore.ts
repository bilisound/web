import { create } from "zustand";
import { BilisoundConfig } from "../../../common";

export type ConfigStoreProps = BilisoundConfig;

export interface ConfigStoreMethods {
    setItem: (item: Partial<ConfigStoreProps>) => void
    getItem: (key: keyof ConfigStoreProps) => any
}

const initialProps = (): BilisoundConfig => window.electron.ipcRenderer.sendSync("config.getAll");

export const useConfigStore = create<ConfigStoreProps & ConfigStoreMethods>()((set, get) => ({
    ...initialProps(),
    getItem: (name: keyof ConfigStoreProps) => get()[name],
    setItem: (item: Partial<ConfigStoreProps>) => {
        set((state) => {
            Object.entries(item).forEach(([k, v]) => {
                window.electron.ipcRenderer.sendSync("config.set", k, v);
            });
            return item;
        });
    },
}));
