export interface BilisoundEnv {
    endpoints: string[];
    debugKey: string;
}

export interface BilisoundCache {
    get: (key: string) => Promise<string>;
    pub: (key: string, value: string, duration?: number) => Promise<void>;
}

export interface BilisoundPlatformTools {
    env: BilisoundEnv;
    cache: BilisoundCache;
}
