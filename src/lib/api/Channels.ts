import type { ChannelDto, CreateChannelDto } from '$lib/contracts';
import { ChannelMapper } from '$lib/mappers';
import type { Channel } from '$lib/types';
import { get, post } from './fetchWrapper';

export class ChannelsApi {
	static async getDefaultChannel(): Promise<Channel> {
		const defaultChannelRes = await get<ChannelDto>('/channels/default');
		return ChannelMapper.DtoToObject(defaultChannelRes);
	}

	static async getAllChannels(): Promise<Channel[]> {
		const allChannelsRes = await get<ChannelDto[]>('/channels');
		return allChannelsRes.map((channel) => ChannelMapper.DtoToObject(channel));
	}

	static async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
		const newChannelRes = await post<CreateChannelDto, ChannelDto>('/channels', createChannelDto);
		return ChannelMapper.DtoToObject(newChannelRes);
	}
}
