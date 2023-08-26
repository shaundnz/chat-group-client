import type { ChannelDto } from '$lib/contracts';
import type { Channel } from '$lib/types';
import { MessageMapper } from './MessageMapper';

export class ChannelMapper {
	static DtoToObject(channelDto: ChannelDto): Channel {
		return {
			id: channelDto.id,
			title: channelDto.title,
			description: channelDto.description,
			members: [],
			messages: channelDto.messages.map((m) => MessageMapper.DtoToObject(m))
		};
	}
}
