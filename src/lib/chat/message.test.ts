import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import type { Message as MessageType } from '$lib/types';
import Message from './Message.svelte';

describe('Message.svelte', () => {
	it('should render', () => {
		const message: MessageType = {
			content: 'message',
			createdAt: new Date()
		};
		const { getByText } = render(Message, { message, userName: 'User One' });
		expect(getByText(message.content)).toBeInTheDocument();
		expect(getByText('User One')).toBeInTheDocument();
	});
});
