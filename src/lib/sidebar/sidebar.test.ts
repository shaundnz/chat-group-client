import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type { ChannelsContext } from '$lib/context';
import Sidebar from './Sidebar.svelte';
import { writable } from 'svelte/store';

const mockChannelsContextStore = writable<ChannelsContext>({
	selectedChannel: null,
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

describe('Sidebar.svelte', () => {
	beforeEach;

	it('should render all channels initially', () => {
		const { getByText, queryByText, getAllByTestId } = render(Sidebar);
		expect(getByText('Channels')).toBeInTheDocument();
		expect(getAllByTestId('channel-button').length).toBe(2);
		expect(queryByText(/The welcome channel/)).not.toBeInTheDocument();
	});

	it('should navigate to and from the selected channel', async () => {
		userEvent.setup();
		const { getByText, getByRole, queryByText } = render(Sidebar);
		const welcomeChannelButton = getByRole('button', { name: 'Welcome' });
		await userEvent.click(welcomeChannelButton);
		expect(getByText('The welcome channel')).toBeInTheDocument();
		const backButton = getByRole('button', { name: 'Back' });
		await backButton.click();
		expect(getByText('Channels')).toBeInTheDocument();
		expect(queryByText('The welcome channel')).not.toBeInTheDocument();
	});
});
