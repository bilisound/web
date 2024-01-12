import type { Static } from "runtypes";
import { Boolean, Record } from "runtypes";
import { create } from "zustand";

export const configStoreProps = Record({
    muted: Boolean,
    autoPlay: Boolean,
    instantSave: Boolean,
    useAv: Boolean,
});

export type ConfigStoreProps = Static<typeof configStoreProps>;

export interface ConfigStoreMethods {
    setItem: (item: Partial<ConfigStoreProps>) => void
    getItem: (key: keyof ConfigStoreProps) => any
}

const defaultProps = (): Static<typeof configStoreProps> => ({
    muted: false,
    autoPlay: false,
    instantSave: true,
    useAv: false,
});

const initialProps = (): ConfigStoreProps => {
    const raw = globalThis.localStorage ? globalThis.localStorage.getItem("bilisound_config") : null;
    if (!raw) {
        return defaultProps();
    }
    try {
        const parsed = JSON.parse(raw);
        configStoreProps.check(parsed);
        return parsed;
    } catch (e) {
        return defaultProps();
    }
};

export const useConfigStore = create<ConfigStoreProps & ConfigStoreMethods>()((set, get) => ({
    ...initialProps(),
    getItem: (name: keyof ConfigStoreProps) => get()[name],
    setItem: (item: Partial<ConfigStoreProps>) => {
        set((state) => {
            localStorage.setItem("bilisound_config", JSON.stringify({ ...state, ...item }));
            return item;
        });
    },
}));
