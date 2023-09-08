import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import InputWithError from './InputWithError.svelte';

describe('InputWithError.svetlte', () => {
	it('should render', () => {
		const { getByLabelText, getByPlaceholderText } = render(InputWithError, {
			errors: [],
			value: '',
			labelText: 'Confirm Password',
			controlId: 'confirm-password'
		});
		expect(getByLabelText('Confirm Password:', { selector: 'input' })).toBeInTheDocument();
		expect(getByPlaceholderText('Confirm Password')).toHaveAttribute('id', 'confirm-password');
	});

	it('should show errors', () => {
		const { getByText } = render(InputWithError, {
			errors: ['Username is taken', 'Username cannot have spaces'],
			value: '',
			labelText: 'Username',
			controlId: 'username'
		});
		expect(getByText('Username is taken')).toHaveClass('text-error');
		expect(getByText('Username cannot have spaces')).toHaveClass('text-error');
	});
});
