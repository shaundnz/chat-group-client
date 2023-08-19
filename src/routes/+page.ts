import type { Channel } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const allChannelsRes = await fetch('http://localhost:3000/channels');
	const allChannelsJson: Channel[] = await allChannelsRes.json();
	return {
		channels: allChannelsJson.map((c) => ({ ...c, members: [] }))
	};
};
