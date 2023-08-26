import type { ChannelDto } from '$lib/contracts';
import { ChannelMapper } from '$lib/mappers';
import type { Channel } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad<{ channels: Channel[]; defaultChannel: Channel }> = async ({
	fetch
}) => {
	const allChannelsRes = await fetch('http://localhost:3000/channels');
	const defaultChannelRes = await fetch('http://localhost:3000/channels/default');
	const allChannelsJson: ChannelDto[] = await allChannelsRes.json();
	const defaultChannelJson: ChannelDto = await defaultChannelRes.json();
	return {
		channels: allChannelsJson.map((c) => ChannelMapper.DtoToObject(c)),
		defaultChannel: ChannelMapper.DtoToObject(defaultChannelJson)
	};
};
