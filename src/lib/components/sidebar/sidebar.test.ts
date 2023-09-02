import '@testing-library/jest-dom';
import { render, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Sidebar from './Sidebar.svelte';
import { setupMockAuthContext, setupMockChannelsContext } from '../../../test/utils';

const initialChannelState = {
	selectedChannelId: '2',
	channelsLoading: false,
	channels: [
		{
			id: '1',
			title: 'Welcome',
			description: 'The welcome channel',
			members: ['User One', 'User Two'],
			messages: []
		},
		{
			id: '2',
			title: 'Front-End Developers',
			description: 'A channel to discuss front end development',
			members: ['User One', 'User Two', 'User Three'],
			messages: []
		}
	]
};

const initialAuthState = {
	user: { username: 'userOne' },
	isUserLoggedIn: true
};

const derivedChannelStore = setupMockChannelsContext(initialChannelState);
const mockAuthContext = setupMockAuthContext(initialAuthState);

vi.mock('$lib/context/channelsContext', async () => {
	const actual: object = await vi.importActual('$lib/context/channelsContext');
	return {
		...actual,
		getChannelsContext: () => derivedChannelStore
	};
});

vi.mock('$lib/context/authContext', async () => {
	const actual: object = await vi.importActual('$lib/context/authContext');
	return {
		...actual,
		getAuthContext: () => mockAuthContext
	};
});

describe('Sidebar.svelte', () => {
	beforeEach;

	it('should render all channels initially', () => {
		const { getByText, queryByText, getByTestId } = render(Sidebar);
		expect(getByText('Channels')).toBeInTheDocument();
		expect(within(getByTestId('all-channels-list')).getAllByRole('listitem')).toHaveLength(2);
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

	it('should render the logged in users username', () => {
		const { getByText } = render(Sidebar);
		expect(getByText('userOne')).toBeInTheDocument();
	});
});
