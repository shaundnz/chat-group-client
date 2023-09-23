import { expect, test, type APIRequestContext } from '@playwright/test';
import { ChatPage } from './chat';
import { io } from 'socket.io-client';
import type { ChannelDto, CreateChannelDto } from '$lib/contracts';
import { AuthPage } from './auth';
import 'dotenv/config';

let apiContext: APIRequestContext;
const channelsTestUser = {
	username: 'chatTestUserOne',
	password: 'pass'
};

const otherChannelsUser = {
	username: 'chatTestUserTwo',
	password: 'pass'
};

let channelsTestUserAccessToken = '';
let otherChannelsUserAccessToken = '';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000';

test.beforeAll(async ({ playwright }) => {
	apiContext = await playwright.request.newContext({
		baseURL: API_BASE_URL
	});

	const createChannelsTestUserRes = await apiContext.post('/auth/signup', {
		data: { ...channelsTestUser, confirmPassword: channelsTestUser.password }
	});
	expect(createChannelsTestUserRes.ok()).toBeTruthy();

	const channelTestUserRes = await apiContext.post('/auth/login', { data: channelsTestUser });
	expect(channelTestUserRes.ok()).toBeTruthy();
	channelsTestUserAccessToken = (await channelTestUserRes.json()).accessToken;
	expect(channelsTestUserAccessToken).toBeTruthy();

	const createOtherChannelsUserRes = await apiContext.post('/auth/signup', {
		data: { ...otherChannelsUser, confirmPassword: otherChannelsUser.password }
	});
	expect(createOtherChannelsUserRes.ok()).toBeTruthy();

	const otherChannelsUserRes = await apiContext.post('/auth/login', { data: otherChannelsUser });
	expect(otherChannelsUserRes.ok()).toBeTruthy();
	otherChannelsUserAccessToken = (await otherChannelsUserRes.json()).accessToken;
	expect(otherChannelsUserAccessToken).toBeTruthy();
});

test.beforeEach(async ({ page }) => {
	const authPage = new AuthPage(page);
	authPage.login(channelsTestUser.username, channelsTestUser.password);
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
	const defaultChannelRes = await apiContext.get('/channels/default', {
		headers: { Authorization: `Bearer ${channelsTestUserAccessToken}` }
	});
	expect(defaultChannelRes.ok()).toBeTruthy();
	const defaultChannel: ChannelDto = await defaultChannelRes.json();
	const socketClient = io(API_BASE_URL, {
		auth: { token: otherChannelsUserAccessToken }
	});

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
	const allChannelsRes = await apiContext.get('/channels', {
		headers: { Authorization: `Bearer ${channelsTestUserAccessToken}` }
	});
	expect(allChannelsRes.ok()).toBeTruthy();
	const allChannels: ChannelDto[] = await allChannelsRes.json();
	const socketClient = io(API_BASE_URL, {
		auth: { token: otherChannelsUserAccessToken }
	});

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

test('current user sees new channel and joins room when a new channel is created', async ({
	page
}) => {
	const chatPage = new ChatPage(page);
	const socketClient = io(API_BASE_URL, {
		auth: { token: otherChannelsUserAccessToken }
	});

	await page.goto('/');
	await chatPage.waitForPageLoad();
	await chatPage.verifyCurrentlySelectedChannel('Welcome');

	const createChannelDto: CreateChannelDto = {
		title: 'Frontend',
		description: 'Space to discuss frontend topics'
	};

	const newChannelRes = await apiContext.post('/channels', {
		data: createChannelDto,
		headers: {
			Authorization: `Bearer ${otherChannelsUserAccessToken}`
		}
	});
	const newChannelJson = await newChannelRes.json();
	await chatPage.goToChannel(createChannelDto.title);
	await chatPage.verifySidebarSingleChannelView(createChannelDto);

	socketClient.emit('message:send', {
		channelId: newChannelJson.id,
		content: 'Hello from the new channel'
	});
	await chatPage.verifyLastMessage('Hello from the new channel');
});
