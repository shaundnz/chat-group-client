import type { Channel } from '$lib/types';
import type { PageLoad } from './$types';
import { ChannelsApi } from '$lib/api';

export const load: PageLoad<{ channels: Channel[]; defaultChannel: Channel }> = async () => {
	const defaultChannel = await ChannelsApi.getDefaultChannel();
	const allChannels = await ChannelsApi.getAllChannels();
	return {
		channels: allChannels,
		defaultChannel: defaultChannel
	};
};
