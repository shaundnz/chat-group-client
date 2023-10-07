import type { MessageDto } from '$lib/contracts';
import type { User } from './User';

export interface Message extends Omit<MessageDto, 'id' | 'channelId' | 'createdAt' | 'user'> {
	createdAt: Date;
	user: User;
}
