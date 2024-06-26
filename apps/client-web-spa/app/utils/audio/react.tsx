import { createContext, PropsWithChildren, useContext, useSyncExternalStore } from "react";
import BilisoundAudioService from "@/utils/audio/instance";

export interface BilisoundAudioServiceContextOptions {
    instance?: BilisoundAudioService;
}

export const BilisoundAudioServiceContext = createContext<BilisoundAudioServiceContextOptions>({});

export function BilisoundAudioServiceProvider({
    instance,
    children,
}: PropsWithChildren<{ instance: BilisoundAudioService }>) {
    return (
        <BilisoundAudioServiceContext.Provider value={{ instance }}>{children}</BilisoundAudioServiceContext.Provider>
    );
}

const NO_CONTEXT_ERROR_MESSAGE = "This hook must be used within <BilisoundAudioServiceProvider />";

export function useIsPlaying() {
    const { instance } = useContext(BilisoundAudioServiceContext);
    if (!instance) {
        throw new Error(NO_CONTEXT_ERROR_MESSAGE);
    }

    return useSyncExternalStore(
        instance.subscribeIsPlaying.bind(instance),
        instance.getSnapshotIsPlaying.bind(instance),
    );
}

export function useStatus() {
    const { instance } = useContext(BilisoundAudioServiceContext);
    if (!instance) {
        throw new Error(NO_CONTEXT_ERROR_MESSAGE);
    }

    return useSyncExternalStore(instance.subscribeStatus.bind(instance), instance.getSnapshotStatus.bind(instance));
}

export function useAudioProgress() {
    const { instance } = useContext(BilisoundAudioServiceContext);
    if (!instance) {
        throw new Error(NO_CONTEXT_ERROR_MESSAGE);
    }

    return useSyncExternalStore(
        instance.subscribeAudioProgress.bind(instance),
        instance.getSnapshotAudioProgress.bind(instance),
    );
}

export function useInstance() {
    const { instance } = useContext(BilisoundAudioServiceContext);
    if (!instance) {
        throw new Error(NO_CONTEXT_ERROR_MESSAGE);
    }

    return instance;
}
