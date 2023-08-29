import '@testing-library/jest-dom';
import { render, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AllChannels from './AllChannels.svelte';

describe('AllChannels.svelte', () => {
	it('should render', () => {
		const props = {
			channels: [
				{
					id: '1',
					title: 'Welcome',
					description: 'Lorem ipsum info here',
					members: ['User 1', 'User 2'],
					messages: []
				},
				{
					id: '2',
					title: 'Front-End Developers',
					description: 'Lorem ipsum Lorem ipsum',
					members: ['User 3', 'User 4'],
					messages: []
				}
			],
			onChannelClick: vi.fn(),
			onCreateChannelButtonClick: vi.fn()
		};

		const { getByText, getByPlaceholderText, getByTestId } = render(AllChannels, props);

		expect(getByText('Channels')).toBeInTheDocument();
		expect(getByPlaceholderText('Search')).toBeInTheDocument();
		props.channels.forEach((channel) => {
			expect(getByText(channel.title)).toBeInTheDocument();
		});
		expect(within(getByTestId('all-channels-list')).getAllByRole('listitem')).toHaveLength(
			props.channels.length
		);
	});

	it('should fire the open modal event', async () => {
		userEvent.setup();
		const onCreateChannelButtonClick = vi.fn();
		const props = {
			channels: [],
			onChannelClick: vi.fn(),
			onCreateChannelButtonClick
		};

		const { getByRole } = render(AllChannels, props);
		const button = getByRole('button', { name: 'Create channel' });
		await userEvent.click(button);
		expect(onCreateChannelButtonClick).toHaveBeenCalled();
	});

	it('should fire the on channel click event', async () => {
		userEvent.setup();
		const onChannelClick = vi.fn();
		const channel = {
			id: '1',
			title: 'Welcome',
			description: 'Lorem ipsum info here',
			members: ['User 1', 'User 2'],
			messages: []
		};
		const props = {
			channels: [channel],
			onChannelClick,
			onCreateChannelButtonClick: vi.fn()
		};

		const { getByRole } = render(AllChannels, props);
		const channelButton = getByRole('button', { name: 'Welcome' });
		await userEvent.click(channelButton);
		expect(onChannelClick).toHaveBeenCalledWith(channel);
	});
});
