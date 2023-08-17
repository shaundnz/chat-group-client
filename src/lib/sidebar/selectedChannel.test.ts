import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SelectedChannel from './SelectedChannel.svelte';

describe('SelectedChannel.svelte', () => {
	it('should render', () => {
		const selectedChannel = {
			channelName: 'Welcome',
			description: 'Lorem ipsum info here',
			members: ['User 1', 'User 2']
		};

		const props = {
			selectedChannel,
			onBackButtonClick: vi.fn()
		};

		const { getByText, getAllByTestId } = render(SelectedChannel, props);

		expect(getByText(selectedChannel.channelName)).toBeInTheDocument();
		expect(getByText(selectedChannel.description)).toBeInTheDocument();
		expect(getAllByTestId('member')).toHaveLength(selectedChannel.members.length);
		selectedChannel.members.forEach((member) => {
			expect(getByText(member)).toBeInTheDocument();
		});
	});

	it('should fire the back event', async () => {
		userEvent.setup();
		const onBackButtonClick = vi.fn();
		const selectedChannel = {
			channelName: 'Welcome',
			description: 'Lorem ipsum info here',
			members: ['User 1', 'User 2']
		};

		const props = {
			selectedChannel,
			onBackButtonClick
		};

		const { getByRole } = render(SelectedChannel, props);
		const button = getByRole('button', { name: 'Back' });
		await userEvent.click(button);
		expect(onBackButtonClick).toHaveBeenCalled();
	});
});
