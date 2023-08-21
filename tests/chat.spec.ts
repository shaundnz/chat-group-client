import { expect, test } from '@playwright/test';

test('landing page places user in the default channel', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});
