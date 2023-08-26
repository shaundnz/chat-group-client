import type { ChannelDto } from '$lib/contracts';
import { ChannelMapper } from './ChannelMapper';
import { MessageMapper } from './MessageMapper';

describe('ChannelMapper', () => {
	it('should map ChannelDto to Channel', () => {
		const channelDto: ChannelDto = {
			id: 'd4521ed4-1741-488c-b0b2-fd35803e9f80',
			title: 'Welcome',
			description: 'Welcome to my chat-app, this is the default channel all users initially join',
			messages: [
				{
					id: 'a1bffea7-3e8a-4c04-b0c2-98338094ecc4',
					channelId: 'd4521ed4-1741-488c-b0b2-fd35803e9f80',
					createdAt: '2023-08-25T12:46:13.882Z',
					content: 'Message 1'
				},
				{
					id: 'dac49a70-fb59-4c51-8264-c5201ffc3a7d',
					channelId: 'd4521ed4-1741-488c-b0b2-fd35803e9f80',
					createdAt: '2023-08-25T23:39:58.598Z',
					content: 'Hello'
				},
				{
					id: 'cd7be8dc-865d-451d-a13a-4319d097b7d0',
					channelId: 'd4521ed4-1741-488c-b0b2-fd35803e9f80',
					createdAt: '2023-08-26T02:58:16.155Z',
					content: 'World'
				}
			]
		};

		const channel = ChannelMapper.DtoToObject(channelDto);
		expect(channel.id).toBe('d4521ed4-1741-488c-b0b2-fd35803e9f80');
		expect(channel.title).toBe('Welcome');
		expect(channel.description).toBe(
			'Welcome to my chat-app, this is the default channel all users initially join'
		);
		expect(channel.members).toEqual([]);
		expect(channel.messages).toEqual(channelDto.messages.map((m) => MessageMapper.DtoToObject(m)));
	});
});
