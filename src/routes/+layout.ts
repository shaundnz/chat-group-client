import { AuthApi, HttpError } from '$lib/api';
import type { User } from '$lib/types';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad<{ user: User | null }> = async () => {
	try {
		const user = await AuthApi.getLoggedInUser();
		return {
			user: user
		};
	} catch (err) {
		if (err instanceof HttpError) {
			if (err.statusCode === 401) return { user: null };
		}
		throw err;
	}
};
