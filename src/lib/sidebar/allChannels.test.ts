import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AllChannels from './AllChannels.svelte';

describe('AllChannels.svelte', () => {
	it('should render', () => {
		const props = {
			channels: [
				{
					channelName: 'Welcome',
					description: 'Lorem ipsum info here',
					members: ['User 1', 'User 2']
				},
				{
					channelName: 'Front-End Developers',
					description: 'Lorem ipsum Lorem ipsum',
					members: ['User 3', 'User 4']
				}
			],
			onChannelClick: vi.fn(),
			onCreateChannelButtonClick: vi.fn()
		};

		const { getByText, getByPlaceholderText, getAllByTestId } = render(AllChannels, props);

		expect(getByText('Channels')).toBeInTheDocument();
		expect(getByPlaceholderText('Search')).toBeInTheDocument();
		props.channels.forEach((channel) => {
			expect(getByText(channel.channelName)).toBeInTheDocument();
		});
		expect(getAllByTestId('channel-button')).toHaveLength(props.channels.length);
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
			channelName: 'Welcome',
			description: 'Lorem ipsum info here',
			members: ['User 1', 'User 2']
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
