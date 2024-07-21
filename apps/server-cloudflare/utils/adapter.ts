import { KVNamespace } from "@cloudflare/workers-types";
import { BilisoundPlatformTools } from "@bilisound2/server-wintercg/src";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function workerAdapter(env: any): BilisoundPlatformTools {
    const cache = env.bilisound as KVNamespace;
    return {
        env: {
            debugKey: env.DEBUG_KEY,
            endpoints: env.ENDPOINT_BILI,
        },
        cache: {
            get: key => cache.get(key),
            put: (key, value, duration) => cache.put(key, value, { expirationTtl: duration }),
        },
    };
}
