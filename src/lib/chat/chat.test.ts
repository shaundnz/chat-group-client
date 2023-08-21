import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Chat from './Chat.svelte';
import type { ChannelsContext } from '$lib/context';
import { writable } from 'svelte/store';
import { vi } from 'vitest';

const mockChannelsContextStore = writable<ChannelsContext>({
	selectedChannel: {
		id: '2',
		title: 'Front-End Developers',
		description: 'A channel to discuss front end development',
		members: ['User One', 'User Two', 'User Three']
	},
	channelsLoading: false,
	channels: [
		{
			id: '1',
			title: 'Welcome',
			description: 'The welcome channel',
			members: ['User One', 'User Two']
		},
		{
			id: '2',
			title: 'Front-End Developers',
			description: 'A channel to discuss front end development',
			members: ['User One', 'User Two', 'User Three']
		}
	]
});

vi.mock('$lib/context', () => {
	return {
		getChannelsContext: () => mockChannelsContextStore
	};
});

describe('Chat.svelte', () => {
	it('should render', () => {
		const channelName = 'Front-End Developers';
		const { getByText, getByPlaceholderText } = render(Chat);
		expect(getByText(channelName)).toBeInTheDocument();
		expect(getByPlaceholderText('Type a message here')).toBeInTheDocument();
	});
});
