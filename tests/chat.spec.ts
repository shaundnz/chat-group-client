import { expect, test, type APIRequestContext } from '@playwright/test';
import 'dotenv/config';
import type { CreateChannelDto } from '$lib/contracts';
import { ChatPage } from './chat';
import { AuthPage } from './auth';
import { ChatApiContext } from './api';
import { getUniqueString } from './utils';

let apiContext: APIRequestContext;

const channelsTestUser = {
	username: '',
	password: 'pass'
};

const otherChannelsUser = {
	username: '',
	password: 'pass'
};

let channelsTestUserAccessToken = '';
let otherChannelsUserAccessToken = '';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

test.beforeAll(async ({ playwright }) => {
	apiContext = await playwright.request.newContext({
		baseURL: API_BASE_URL + '/'
	});

	const chatApi = new ChatApiContext(apiContext);

	channelsTestUser.username = getUniqueString('channelsTestUser');
	await chatApi.signUp({ ...channelsTestUser, confirmPassword: channelsTestUser.password });
	channelsTestUserAccessToken = await chatApi.login(channelsTestUser);

	otherChannelsUser.username = getUniqueString('otherChannelsUser');
	await chatApi.signUp({ ...otherChannelsUser, confirmPassword: otherChannelsUser.password });
	otherChannelsUserAccessToken = await chatApi.login(otherChannelsUser);
});

test.beforeEach(async ({ page }) => {
	const authPage = new AuthPage(page);
	authPage.login(channelsTestUser);
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
	await chatPage.verifySidebarChannel('Welcome');
});

test('user can create a new channel and automatically navigates to it', async ({ page }) => {
	const chatPage = new ChatPage(page);

	const channel = {
		title: getUniqueString('My new channel'),
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
	await chatPage.verifySidebarChannel(channel.title);

	// Send a message
	await chatPage.sendMessage('Hello world!');
	await chatPage.verifyLastMessage(channelsTestUser.username, 'Hello world!');
});

test('channel messages are persisted', async ({ page }) => {
	const chatPage = new ChatPage(page);

	await page.goto('/');
	await chatPage.waitForPageLoad();
	await chatPage.verifyCurrentlySelectedChannel('Welcome');
	await chatPage.sendMessage('Message 1');
	await chatPage.sendMessage('Message 2');
	await chatPage.verifyLastNMessages([
		{ username: channelsTestUser.username, content: 'Message 2' },
		{ username: channelsTestUser.username, content: 'Message 1' }
	]);
	await page.reload();
	await chatPage.waitForPageLoad();
	await chatPage.waitForPageLoad();
	await chatPage.verifyCurrentlySelectedChannel('Welcome');
	await chatPage.verifyLastNMessages([
		{ username: channelsTestUser.username, content: 'Message 2' },
		{ username: channelsTestUser.username, content: 'Message 1' }
	]);
});

test('user sees a new message from another user', async ({ page }) => {
	const chatApi = new ChatApiContext(apiContext);
	const chatPage = new ChatPage(page);

	const otherChannelsUserSocketClient = chatApi.createSocket(
		API_BASE_URL,
		otherChannelsUserAccessToken
	);

	const createChannelDto: CreateChannelDto = {
		title: getUniqueString('New channel'),
		description: 'Space to discuss frontend topics'
	};

	const newChannel = await chatApi.createChannel(createChannelDto, channelsTestUserAccessToken);

	await page.goto('/');
	await chatPage.waitForPageLoad();
	await chatPage.goToChannel(newChannel.title);
	await chatPage.verifyCurrentlySelectedChannel(newChannel.title);

	chatApi.sendMessage(otherChannelsUserSocketClient, {
		channelId: newChannel.id,
		content: 'A message from another user'
	});

	await chatPage.verifyLastMessage(otherChannelsUser.username, 'A message from another user');
});

test('messages from another user in an unselected channel are visible when selected', async ({
	page
}) => {
	const chatApi = new ChatApiContext(apiContext);
	const chatPage = new ChatPage(page);

	const createChannelDto: CreateChannelDto = {
		title: getUniqueString('New channel'),
		description: 'Space to discuss frontend topics'
	};

	const newChannel = await chatApi.createChannel(createChannelDto, channelsTestUserAccessToken);
	const otherChannelsUserSocketClient = chatApi.createSocket(
		API_BASE_URL,
		otherChannelsUserAccessToken
	);

	await page.goto('/');
	await chatPage.waitForPageLoad();
	await chatPage.verifyCurrentlySelectedChannel('Welcome');

	await chatPage.sendMessage('Welcome channel message');
	await chatPage.verifyLastMessage(channelsTestUser.username, 'Welcome channel message');

	chatApi.sendMessage(otherChannelsUserSocketClient, {
		channelId: newChannel.id,
		content: 'A message from another user in another channel'
	});

	await chatPage.verifyLastMessage(channelsTestUser.username, 'Welcome channel message');
	await chatPage.goToChannel(newChannel.title);
	await chatPage.verifyLastMessage(
		otherChannelsUser.username,
		'A message from another user in another channel'
	);
});

test('current user sees new channel and joins room when a new channel is created', async ({
	page
}) => {
	const chatApi = new ChatApiContext(apiContext);
	const chatPage = new ChatPage(page);

	const otherChannelsUserSocketClient = chatApi.createSocket(
		API_BASE_URL,
		otherChannelsUserAccessToken
	);

	await page.goto('/');
	await chatPage.waitForPageLoad();
	await chatPage.verifyCurrentlySelectedChannel('Welcome');

	const createChannelDto: CreateChannelDto = {
		title: getUniqueString('Frontend'),
		description: 'Space to discuss frontend topics'
	};

	const newChannel = await chatApi.createChannel(createChannelDto, otherChannelsUserAccessToken);

	await chatPage.goToChannel(createChannelDto.title);
	await chatPage.verifySidebarSingleChannelView(createChannelDto);

	chatApi.sendMessage(otherChannelsUserSocketClient, {
		channelId: newChannel.id,
		content: 'Hello from the new channel'
	});

	await chatPage.verifyLastMessage(otherChannelsUser.username, 'Hello from the new channel');
});
