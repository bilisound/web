import { merge } from 'lodash-es';
import CORS_HEADERS from '../constants/cors';
import { WebPlayInfo } from "../types";

export const AjaxSuccess = (data: any, options: RequestInit = {}) => {
	return new Response(JSON.stringify({
			data,
			code: 200,
			msg: 'ok',
		}),
		merge({
			headers: {
				...CORS_HEADERS,
				'Content-Type': 'application/json',
			},
		} as ResponseInit, options));
};

export const AjaxError = (msg: any, code = 500, options: RequestInit = {}) => {
	return new Response(JSON.stringify({
			code,
			data: null,
			msg: String(msg),
		}),
		merge({
			status: code,
			headers: {
				...CORS_HEADERS,
				'Content-Type': 'application/json',
			},
		} as ResponseInit, options),
	);
};

export const fineBestAudio = (dashAudio: WebPlayInfo["data"]["dash"]["audio"]) => {
	let maxQualityIndex = 0;
	dashAudio.forEach((value, index, array) => {
		if (array[maxQualityIndex].codecid < maxQualityIndex) {
			maxQualityIndex = index;
		}
	});
	return maxQualityIndex;
}

export function pickRandom<T>(item: T[]) {
	return item[Math.floor(Math.random() * item.length)]
}
