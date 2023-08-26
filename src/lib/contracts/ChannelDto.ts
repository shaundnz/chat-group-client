import type { MessageDto } from './MessageDto';

export interface ChannelDto {
	id: string;
	title: string;
	description: string;
	messages: MessageDto[];
}
