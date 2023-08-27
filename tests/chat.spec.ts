import { expect, test, type APIRequestContext } from '@playwright/test';
import { ChatPage } from './chat';
import { io } from 'socket.io-client';
import type { ChannelDto } from '$lib/contracts';

let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
	apiContext = await playwright.request.newContext({
		// All requests we send go to this API endpoint.
		baseURL: 'http://localhost:3000'
	});
});

test.afterAll(async () => {
	// Dispose all responses.
	await apiContext.dispose();
});

test('landing page places user in the default channel', async ({ page }) => {
	const chatPage = new ChatPage(page);

	await page.goto('/');
	await chatPage.waitForPageLoad();
	await chatPage.verifyCurrentlySelectedChannel('Welcome');
	await chatPage.verifySidebarAllChannelsView(['Welcome']);
});

test('user can create a new channel and automatically navigates to it', async ({ page }) => {
	const chatPage = new ChatPage(page);

	const channel = {
		title: 'My new channel',
		description: 'A cool description'
	};
	await page.goto('/');
	await chatPage.waitForPageLoad();

	// Verify initial channel
	await expect(page.getByRole('heading', { level: 1, name: 'Welcome' })).toBeVisible();

	// Verify modal
	const createChannelModal = page.getByTestId('create-channel-modal');
	await chatPage.verifyModalClosed();
	await page.getByRole('button', { name: 'Create channel' }).click();
	await chatPage.verifyModalOpen();

	// Submit modal
	await createChannelModal.getByLabel('Title').fill(channel.title);
	await createChannelModal.getByLabel('Description').fill(channel.description);
	await createChannelModal.getByRole('button', { name: 'Save' }).click();

	// Verify selected channel
	await chatPage.verifyModalClosed();
	await chatPage.verifyCurrentlySelectedChannel(channel.title);
	await chatPage.verifySidebarSingleChannelView(channel);

	// Verify new channel in all channel view
	await page.getByRole('button', { name: 'Back' }).click();
	await chatPage.verifySidebarAllChannelsView(['Welcome', channel.title]);
});

test('channel messages are persisted', async ({ page }) => {
	const chatPage = new ChatPage(page);
	await page.goto('/');
	await chatPage.waitForPageLoad();
	await chatPage.verifyCurrentlySelectedChannel('Welcome');
	await chatPage.sendMessage('Message 1');
	await chatPage.sendMessage('Message 2');
	await chatPage.verifyAllMessages(['Message 1', 'Message 2']);
	await page.reload();
	await chatPage.waitForPageLoad();
	await chatPage.waitForPageLoad();
	await chatPage.verifyCurrentlySelectedChannel('Welcome');
	await chatPage.verifyAllMessages(['Message 1', 'Message 2']);
});

test('user can send a message to any channel', async ({ page }) => {
	const chatPage = new ChatPage(page);

	await page.goto('/');
	await chatPage.waitForPageLoad();
	await chatPage.verifyCurrentlySelectedChannel('Welcome');
	await chatPage.goToChannel('My new channel');
	await chatPage.sendMessage('Hello world!');
	await chatPage.verifyAllMessages(['Hello world!']);
});

test('user sees a new message from another user', async ({ page }) => {
	const defaultChannelRes = await apiContext.get('/channels/default');
	expect(defaultChannelRes.ok()).toBeTruthy();
	const defaultChannel: ChannelDto = await defaultChannelRes.json();
	const socketClient = io('http://localhost:3000');

	const chatPage = new ChatPage(page);
	await page.goto('/');
	await chatPage.waitForPageLoad();
	await chatPage.verifyCurrentlySelectedChannel('Welcome');
	socketClient.emit('message:send', {
		channelId: defaultChannel.id,
		content: 'A message from another user'
	});
	await chatPage.verifyLastMessage('A message from another user');
});

test('messages from another user in an unselected channel are visible when selected', async ({
	page
}) => {
	const allChannelsRes = await apiContext.get('/channels');
	expect(allChannelsRes.ok()).toBeTruthy();
	const allChannels: ChannelDto[] = await allChannelsRes.json();
	const socketClient = io('http://localhost:3000');

	const chatPage = new ChatPage(page);
	await page.goto('/');
	await chatPage.waitForPageLoad();
	await chatPage.verifyCurrentlySelectedChannel('Welcome');

	await chatPage.sendMessage('Welcome channel message');
	await chatPage.verifyLastMessage('Welcome channel message');

	socketClient.emit('message:send', {
		channelId: allChannels[1].id,
		content: 'A message from another user in another channel'
	});

	await chatPage.verifyLastMessage('Welcome channel message');
	await chatPage.goToChannel(allChannels[1].title);
	await chatPage.verifyLastMessage('A message from another user in another channel');
});
