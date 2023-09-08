import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import InputWithError from './InputWithError.svelte';

describe('InputWithError.svetlte', () => {
	it('should render', () => {
		const { getByLabelText, getByPlaceholderText } = render(InputWithError, {
			errors: [],
			value: '',
			labelText: 'Username',
			controlId: 'username'
		});
		expect(getByLabelText('Username:', { selector: 'input' })).toBeInTheDocument();
		expect(getByLabelText('Username:', { selector: 'input' })).toHaveAttribute('type', 'text');
		expect(getByPlaceholderText('Username')).toHaveAttribute('id', 'username');
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

	it('should hide inputs with the password type', () => {
		const { getByLabelText } = render(InputWithError, {
			errors: [],
			value: '',
			labelText: 'Confirm Password',
			controlId: 'confirm-password',
			password: true
		});
		expect(getByLabelText('Confirm Password:', { selector: 'input' })).toHaveAttribute(
			'type',
			'password'
		);
	});
});
