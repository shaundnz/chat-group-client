import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Banner from './Banner.svelte';

describe('Banner.svelte', () => {
	it('should render', () => {
		const { getByText, getByRole } = render(Banner, { channelName: 'Front End Developers' });
		expect(getByText('Front End Developers')).toBeInTheDocument();
		expect(getByRole);
	});
});
