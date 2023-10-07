import type { UserDto } from './UserDto';

export interface MessageDto {
	id: string;
	createdAt: string;
	channelId: string;
	content: string;
	user: UserDto;
}
