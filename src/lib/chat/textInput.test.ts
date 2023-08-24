import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import TextInput from './TextInput.svelte';

describe('TextInput.svelte', () => {
	it('should render', () => {
		const { getByPlaceholderText } = render(TextInput, { onSendClick: vi.fn() });
		expect(getByPlaceholderText('Type a message here')).toBeInTheDocument();
	});

	it('should submit', async () => {
		const user = userEvent.setup();
		const onSendClick = vi.fn();
		const { getByRole } = render(TextInput, { onSendClick });

		const textarea = getByRole('textbox');

		await user.type(textarea, 'Hello world');
		const button = getByRole('button');
		await user.click(button);

		expect(onSendClick).toHaveBeenCalledTimes(1);
		expect(onSendClick).toHaveBeenCalledWith('Hello world');
	});

	it('should submit when pressing enter within the textarea', async () => {
		const user = userEvent.setup();
		const onSendClick = vi.fn();
		const { getByRole } = render(TextInput, { onSendClick });

		const textarea = getByRole('textbox');
		await user.type(textarea, 'Hello world');
		await user.keyboard('{Enter}');

		expect(onSendClick).toHaveBeenCalledTimes(1);
		expect(onSendClick).toHaveBeenCalledWith('Hello world');
	});

	it('should require text to submit', async () => {
		const user = userEvent.setup();
		const onSendClick = vi.fn();
		const { getByRole } = render(TextInput, { onSendClick });

		const textarea = getByRole('textbox');
		await user.click(textarea);

		const button = getByRole('button');
		await user.click(button);

		expect(onSendClick).not.toHaveBeenCalled();
	});
});
