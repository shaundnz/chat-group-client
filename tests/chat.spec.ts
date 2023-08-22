import { expect, test } from '@playwright/test';
import { ChatPage } from './chat';

test('landing page places user in the default channel', async ({ page }) => {
	await page.goto('/');
	await ChatPage.verifyCurrentlySelectedChannel(page, 'Welcome');
	await ChatPage.verifySidebarAllChannelsView(page, ['Welcome']);
});

test('user can create a new channel and automatically navigates to it', async ({ page }) => {
	const channel = {
		title: 'My new channel',
		description: 'A cool description'
	};
	await page.goto('/');

	// Verify initial channel
	await expect(page.getByRole('heading', { level: 1, name: 'Welcome' })).toBeVisible();

	// Verify modal
	const createChannelModal = page.getByTestId('create-channel-modal');
	await ChatPage.verifyModalClosed(createChannelModal);
	await page.getByRole('button', { name: 'Create channel' }).click();
	await ChatPage.verifyModalOpen(createChannelModal);

	// Submit modal
	await createChannelModal.getByLabel('Title').fill(channel.title);
	await createChannelModal.getByLabel('Description').fill(channel.description);
	await createChannelModal.getByRole('button', { name: 'Save' }).click();

	// Verify selected channel
	await ChatPage.verifyModalClosed(createChannelModal);
	await ChatPage.verifyCurrentlySelectedChannel(page, channel.title);
	await ChatPage.verifySidebarSingleChannelView(page, channel);

	// Verify new channel in all channel view
	await page.getByRole('button', { name: 'Back' }).click();
	await ChatPage.verifySidebarAllChannelsView(page, ['Welcome', channel.title]);
});
