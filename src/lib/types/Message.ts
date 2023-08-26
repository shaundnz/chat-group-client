import type { MessageDto } from '$lib/contracts';

export interface Message extends Omit<MessageDto, 'id' | 'channelId' | 'createdAt'> {
	createdAt: Date;
}
