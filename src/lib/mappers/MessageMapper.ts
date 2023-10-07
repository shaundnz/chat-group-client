import type { MessageDto } from '$lib/contracts';
import type { Message } from '$lib/types';

export class MessageMapper {
	static DtoToObject(messageDto: MessageDto): Message {
		return {
			content: messageDto.content,
			createdAt: new Date(messageDto.createdAt),
			user: {
				username: messageDto.user.username
			}
		};
	}
}
