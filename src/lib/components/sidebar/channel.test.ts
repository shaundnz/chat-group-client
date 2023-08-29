import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Channel from './Channel.svelte';

describe('Channel.svelte', () => {
	it('should render the channel', () => {
		const { getByText } = render(Channel, { channelName: 'Test Channel' });
		expect(getByText('Test Channel')).toBeInTheDocument();
	});

	it.each([
		['Test Channel', 'TC'],
		['Front-End Developer', 'FD'],
		['aa bb Cc', 'AB']
	])('should render the channel acronym', (channelName, acronym) => {
		const { getByText } = render(Channel, { channelName });
		expect(getByText(acronym)).toBeInTheDocument();
	});
});
