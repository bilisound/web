export interface BilisoundEnv {
    endpoints: BilisoundEndpoint[];
    debugKey: string;
}

export interface BilisoundEndpoint {
    url: string;
    key?: string;
}

export interface BilisoundCache {
    get: (key: string) => Promise<string>;
    put: (key: string, value: string, duration?: number) => Promise<void>;
}

export interface BilisoundPlatformTools {
    env: BilisoundEnv;
    cache: BilisoundCache;
}
