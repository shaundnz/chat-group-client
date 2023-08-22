import type { Channel } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const allChannelsRes = await fetch('http://localhost:3000/channels');
	const defaultChannelRes = await fetch('http://localhost:3000/channels/default');
	const allChannelsJson: Channel[] = await allChannelsRes.json();
	const defaultChannelJson: Channel = await defaultChannelRes.json();
	return {
		channels: allChannelsJson.map((c) => ({ ...c, members: [] })),
		defaultChannel: { ...defaultChannelJson, members: [] }
	};
};
