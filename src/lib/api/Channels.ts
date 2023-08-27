import type { ChannelDto, CreateChannelDto } from '$lib/contracts';
import { ChannelMapper } from '$lib/mappers';
import type { Channel } from '$lib/types';

export class ChannelsApi {
	static async getDefaultChannel(): Promise<Channel> {
		const defaultChannelRes = await fetch('http://localhost:3000/channels/default');
		const defaultChannelJson: ChannelDto = await defaultChannelRes.json();
		return ChannelMapper.DtoToObject(defaultChannelJson);
	}

	static async getAllChannels(): Promise<Channel[]> {
		const allChannelsRes = await fetch('http://localhost:3000/channels');
		const allChannelsJson: ChannelDto[] = await allChannelsRes.json();
		return allChannelsJson.map((channel) => ChannelMapper.DtoToObject(channel));
	}

	static async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
		const newChannelRes = await fetch('http://localhost:3000/channels', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(createChannelDto)
		});

		const newChannelJson: ChannelDto = await newChannelRes.json();
		return ChannelMapper.DtoToObject(newChannelJson);
	}
}
