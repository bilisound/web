import { KVNamespace } from '@cloudflare/workers-types';
import { InitialStateResponse, WebPlayInfo } from '../types';
import { extractJSON } from '../utils/string';

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
const CACHE_PREFIX = "bili_page";

export async function getVideo(id: string, episode: string | number, cache: KVNamespace): Promise<{
	initialState: InitialStateResponse,
	playInfo: WebPlayInfo,
}> {
	const key = CACHE_PREFIX + "_" + id + "_" + episode;
	const got = await cache.get(key);
	// console.log("缓存内容", got);
	if (got) {
		// console.log("缓存命中");
		return JSON.parse(got);
	}
	// console.log("缓存没有命中");
	const response = await fetch('https://www.bilibili.com/video/' + id + '/?p=' + episode, {
		headers: {
			'user-agent': USER_AGENT,
		},
	}).then((e) => {
		return e.text();
	});

	// 提取视频播放信息
	const initialState: InitialStateResponse = extractJSON(/window\.__INITIAL_STATE__={(.+)};/, response);
	const playInfo: WebPlayInfo = extractJSON(/window\.__playinfo__={(.+)}<\/script><script>/, response);
	const obj = { initialState, playInfo };
	await cache.put(key, JSON.stringify(obj), { expirationTtl: 5400 }); // 90 分钟
	return obj;
}

export function getVideoUrl(id: string, episode: string | number) {
	return 'https://www.bilibili.com/video/' + id + '/?p=' + episode;
}
