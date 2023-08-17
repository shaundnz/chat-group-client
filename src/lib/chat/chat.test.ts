import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Chat from './Chat.svelte';

describe('Chat.svelte', () => {
	it('should render', () => {
		const channelName = 'Front End Developer';
		const { getByText, getByPlaceholderText } = render(Chat, {
			channelName
		});
		expect(getByText(channelName)).toBeInTheDocument();
		expect(getByPlaceholderText('Type a message here')).toBeInTheDocument();
	});
});
