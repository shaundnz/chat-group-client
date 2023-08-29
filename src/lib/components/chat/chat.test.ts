import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Chat from './Chat.svelte';
import { vi } from 'vitest';
import { setupMockChannelsContext } from '../../../test';
import type { ChannelsStore } from '$lib/context/channelsContext';

const initialState: ChannelsStore = {
	selectedChannelId: '2',
	channelsLoading: false,
	channels: [
		{
			id: '1',
			title: 'Welcome',
			description: 'The welcome channel',
			members: ['User One', 'User Two'],
			messages: [{ content: 'message 1', createdAt: new Date() }]
		},
		{
			id: '2',
			title: 'Front-End Developers',
			description: 'A channel to discuss front end development',
			members: ['User One', 'User Two', 'User Three'],
			messages: [
				{ content: 'message 2', createdAt: new Date() },
				{ content: 'message 3', createdAt: new Date() }
			]
		}
	]
};

const derivedChannelStore = setupMockChannelsContext(initialState);

vi.mock('$lib/context/channelsContext', async () => {
	const actual: object = await vi.importActual('$lib/context/channelsContext');
	return {
		...actual,
		getChannelsContext: () => derivedChannelStore
	};
});

describe('Chat.svelte', () => {
	it('should render', () => {
		const channelName = 'Front-End Developers';
		const { getByText, getByPlaceholderText } = render(Chat);
		expect(getByText(channelName)).toBeInTheDocument();
		expect(getByPlaceholderText('Type a message here')).toBeInTheDocument();
	});

	it('should show the messages of the selected channel', () => {
		const { getByText, queryByText, getAllByTestId } = render(Chat);
		expect(getAllByTestId('message')).toHaveLength(2);
		expect(getByText('message 2')).toBeInTheDocument();
		expect(getByText('message 3')).toBeInTheDocument();
		expect(queryByText('message 1')).not.toBeInTheDocument();
	});
});
