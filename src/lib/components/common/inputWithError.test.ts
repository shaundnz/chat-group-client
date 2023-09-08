import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import InputWithError from './InputWithError.svelte';

describe('InputWithError.svetlte', () => {
	it('should render', () => {
		const { getByLabelText, getByPlaceholderText } = render(InputWithError, {
			errors: [],
			value: '',
			label: 'Username'
		});
		expect(getByLabelText('Username:')).toBeInTheDocument();
		expect(getByPlaceholderText('Username')).toBeInTheDocument();
	});

	it('should show errors', () => {
		const { getByText } = render(InputWithError, {
			errors: ['Username is taken'],
			value: '',
			label: 'Username'
		});
		expect(getByText('Username is taken')).toBeInTheDocument();
		expect(getByText('Username is taken')).toHaveClass('text-error');
	});
});
