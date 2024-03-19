import { RouterType } from 'itty-router';
import { AjaxError, AjaxSuccess } from '../utils/misc';
import CORS_HEADERS from '../constants/cors';
import { KVNamespace } from '@cloudflare/workers-types';
import { getVideo } from '../api/bilibili';
import { v4 } from "uuid";

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

export default function bilisound(router: RouterType) {
	router.get('/api/internal/resolve-b23', async (request) => {
		const id = request.query.id;
		if (typeof id !== 'string') {
			return AjaxError('api usage error', 400);
		}

		try {
			const response = await fetch('https://b23.tv/' + id, {
				headers: {
					'user-agent': USER_AGENT,
				},
				redirect: 'manual',
			});

			const target = response.headers.get('location');
			if (!target) {
				return AjaxError('bad location', 404);
			}

			return AjaxSuccess(response.headers.get('location'));
		} catch (e) {
			return AjaxError(e);
		}
	});

	router.get('/api/internal/metadata', async (request, env) => {
		const cache = env.bilisound as KVNamespace;
		const id = request.query.id;
		if (typeof id !== 'string') {
			return AjaxError('api usage error', 400);
		}

		try {
			// 获取视频网页
			const { initialState } = await getVideo(id, 1, cache);

			// 提取视频信息
			const videoData = initialState?.videoData;
			const pages = videoData?.pages ?? [];
			if (pages.length <= 0) {
				return AjaxError('no video found', 404);
			}

			return AjaxSuccess({
				bvid: videoData.bvid,
				aid: videoData.aid,
				title: videoData.title,
				pic: videoData.pic,
				owner: videoData.owner,
				desc: videoData.desc,
				pubDate: videoData.pubdate * 1000,
				pages: pages.map(({ page, part, duration }) => ({ page, part, duration })),
			});
		} catch (e) {
			return AjaxError(e);
		}
	});

	router.get('/api/internal/resource', async (request, env) => {
		const cache = env.bilisound as KVNamespace;
		const id = request.query.id;
		const episode = Number(request.query.episode);
		if (typeof id !== 'string' || !Number.isInteger(episode) || episode < 1) {
			return AjaxError('api usage error', 400);
		}

		try {
			// 获取视频
			const { playInfo } = await getVideo(id, episode, cache);
			const dashAudio = playInfo?.data?.dash?.audio ?? [];

			if (!dashAudio) {
				return AjaxError('no dash data found');
			}

			// 遍历获取最佳音质视频
			let maxQualityIndex = 0;
			dashAudio.forEach((value, index, array) => {
				if (array[maxQualityIndex].codecid < maxQualityIndex) {
					maxQualityIndex = index;
				}
			});

			// 将音频字节流进行转发
			const range = request.headers.get('Range');
			const res = await fetch(dashAudio[maxQualityIndex].baseUrl, {
				headers: {
					'user-agent': USER_AGENT,
					'referer': 'https://www.bilibili.com/video/' + id + '/?p=' + episode,
					'Range': range,
				},
			});

			return new Response(await res.arrayBuffer(), {
				status: range ? 206 : 200,
				headers: {
					...CORS_HEADERS,
					'Content-Type': 'audio/mp4',
					'Accept-Ranges': 'bytes',
					'Cache-Control': 'max-age=604800',
					...(range ? {
						'Content-Range': res.headers.get('Content-Range'),
						'Content-Length': res.headers.get('Content-Length'),
					} : {}),
				},
			});
		} catch (e) {
			return AjaxError(e);
		}
	});

	router.get('/api/internal/resource-metadata', async (request, env) => {
		const cache = env.bilisound as KVNamespace;
		const id = request.query.id;
		const episode = Number(request.query.episode);
		if (typeof id !== 'string' || !Number.isInteger(episode) || episode < 1) {
			return AjaxError('api usage error', 400);
		}

		try {
			// 获取视频
			const { playInfo, initialState } = await getVideo(id, episode, cache);
			const dashAudio = playInfo?.data?.dash?.audio ?? [];

			if (!dashAudio) {
				return AjaxError('no dash data found');
			}

			// 遍历获取最佳音质视频
			let maxQualityIndex = 0;
			dashAudio.forEach((value, index, array) => {
				if (array[maxQualityIndex].codecid < maxQualityIndex) {
					maxQualityIndex = index;
				}
			});

			const item = dashAudio[maxQualityIndex];
			const res = await fetch(item.baseUrl, {
				method: "head",
				headers: {
					'user-agent': USER_AGENT,
					'referer': 'https://www.bilibili.com/video/' + id + '/?p=' + episode,
				},
			});

			// 查询文件大小
			const pageItem = initialState.videoData.pages.find((e) => e.page === episode);

			return AjaxSuccess({
				duration: pageItem?.duration ?? 0,
				fileSize: Number(res.headers.get("Content-Length") ?? 0)
			});
		} catch (e) {
			return AjaxError(e);
		}
	});

	router.get('/api/internal/img-proxy', async (request, env) => {
		try {
			const url = request.query.url;
			const referrer = request.query.referrer;
			if (!(typeof url === "string" && typeof referrer === "string")) {
				return new Response("", { status: 400 })
			}

			if (!new URL(url).hostname.endsWith("hdslb.com")) {
				return new Response("", { status: 403 })
			}

			const res = await fetch(url, {
				headers: {
					'user-agent': request.headers.get("user-agent") || USER_AGENT,
					'referer': 'https://www.bilibili.com/video/' + referrer,
				},
			});

			return new Response(await res.arrayBuffer(), {
				headers: {
					...CORS_HEADERS,
					'Cache-Control': 'max-age=604800',
					'Content-Type': res.headers.get("Content-Type")
				},
			});
		} catch (e) {
			console.error(e);
			return new Response("", { status: 500 })
		}
	});

	router.get('/api/internal/raw', async (request, env) => {
		const cache = env.bilisound as KVNamespace;
		const id = request.query.id;
		if (typeof id !== 'string') {
			return AjaxError('api usage error', 400);
		}

		try {
			// 获取视频网页
			const response = await getVideo(id, 1, cache);
			return AjaxSuccess(response);
		} catch (e) {
			return AjaxError(e);
		}
	});

	router.post("/api/internal/transfer-list", async (request, env) => {
		const cache = env.bilisound as KVNamespace;
		const keySuffix = v4();
		try {
			// 请求预检
			if (request.headers.get("content-type") !== "application/json") {
				return AjaxError("Unsupported data type", 400);
			}

			// 读取用户传输的数据
			const userInput = await request.json();
			if (!Array.isArray(userInput)) {
				return AjaxError("Unsupported data type", 400);
			}

			await cache.put(`transfer_list_${keySuffix}`, JSON.stringify(userInput, (key, value) => {
				if (key === "key" || key === "url") {
					return undefined;
				}
				return value;
			}), { expirationTtl: 330 }); // 5 分钟 30 秒
			return AjaxSuccess(keySuffix);
		} catch (e) {
			return AjaxError(e);
		}
	});

	router.get("/api/internal/transfer-list/:id", async (request, env) => {
		const cache = env.bilisound as KVNamespace;
		const { params } = request;
		const keySuffix = params.id;

		const got = await cache.get(`transfer_list_${keySuffix}`);

		return AjaxSuccess(JSON.parse(got));
	});
}
