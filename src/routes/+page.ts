import type { Channel } from '$lib/types';
import type { PageLoad } from './$types';
import { ChannelsApi } from '$lib/api';
import { redirect } from '@sveltejs/kit';
import { HttpError } from '$lib/api';

export const ssr = false;

export const load: PageLoad<{ channels: Channel[]; defaultChannel: Channel }> = async () => {
	try {
		const defaultChannel = await ChannelsApi.getDefaultChannel();
		const allChannels = await ChannelsApi.getAllChannels();

		return {
			channels: allChannels,
			defaultChannel: defaultChannel
		};
	} catch (err) {
		if (err instanceof HttpError) {
			if (err.statusCode === 401) throw redirect(307, '/auth/login');
		}
		throw err;
	}
};
