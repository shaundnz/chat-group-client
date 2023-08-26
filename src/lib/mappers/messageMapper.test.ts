import type { MessageDto } from '$lib/contracts';
import { MessageMapper } from './MessageMapper';

describe('MessageMapper', () => {
	it('should map MessageDto to Message', () => {
		const messageDto: MessageDto = {
			id: 'a1bffea7-3e8a-4c04-b0c2-98338094ecc4',
			createdAt: '2023-08-25T12:46:13.882Z',
			content: 'Hello world!',
			channelId: 'd4521ed4-1741-488c-b0b2-fd35803e9f80'
		};
		const message = MessageMapper.DtoToObject(messageDto);
		expect(message.content).toBe('Hello world!');
		expect(message.createdAt).toEqual(new Date(messageDto.createdAt));
	});
});
