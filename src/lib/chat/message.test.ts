import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Message from './Message.svelte';

describe('Message.svelte', () => {
	it('should render', () => {
		const props = {
			message: 'message',
			userName: 'User Name',
			time: '1 hour ago'
		};
		const { getByText } = render(Message, { ...props });
		expect(getByText(props.message)).toBeInTheDocument();
		expect(getByText(props.userName)).toBeInTheDocument();
		expect(getByText(props.time)).toBeInTheDocument();
	});
});
