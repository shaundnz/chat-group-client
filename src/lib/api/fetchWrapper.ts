import type { ErrorDto } from '$lib/contracts';
import { HttpError } from './HttpError';

function client<T>(endpoint: string, config: RequestInit): Promise<T> {
	const headers = { 'Content-Type': 'application/json' };
	config.headers = { ...headers, ...config.headers };

	return fetch(`http://localhost:3000${endpoint}`, config).then(async (response) => {
		if (response.ok) {
			return await response.json();
		} else {
			const errorRes: ErrorDto = await response.json();
			return Promise.reject(new HttpError(errorRes));
		}
	});
}

export async function get<T>(path: string, config?: RequestInit): Promise<T> {
	const init = { method: 'get', ...config };
	return await client<T>(path, init);
}

export async function post<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
	const init = { method: 'post', body: JSON.stringify(body), ...config };
	return await client<U>(path, init);
}

export async function put<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
	const init = { method: 'put', body: JSON.stringify(body), ...config };
	return await client<U>(path, init);
}