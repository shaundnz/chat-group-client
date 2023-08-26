import type { ChannelDto } from '$lib/contracts';
import type { Message } from './Message';

export interface Channel extends Omit<ChannelDto, 'messages'> {
	members: string[];
	messages: Message[];
}
