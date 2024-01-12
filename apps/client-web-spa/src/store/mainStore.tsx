import { create } from "zustand";
import { cloneDeep } from "lodash-es";

export interface MainStoreProps {
    enableFlexCenterHack: boolean
}

export interface MainStoreMethods {
    setEnableFlexCenterHack: (enableFlexCenterHack: boolean) => void
    reset: () => void
}

const defaultProps: MainStoreProps = {
    enableFlexCenterHack: false,
};

export const useMainStore = create<MainStoreProps & MainStoreMethods>()((set) => ({
    ...cloneDeep(defaultProps),
    setEnableFlexCenterHack: (enableFlexCenterHack) => set((state) => ({ enableFlexCenterHack })),
    reset: () => set(defaultProps),
}));
