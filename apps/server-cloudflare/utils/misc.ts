import { merge } from 'lodash-es';
import CORS_HEADERS from '../constants/cors';
import { ResponseInit } from '@cloudflare/workers-types/2021-11-03/index';

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
