import { test, type APIRequestContext } from '@playwright/test';
import 'dotenv/config';
import { AuthPage } from './auth';
import { ChatPage } from './chat';
import { getUniqueString } from './utils';
import { ChatApiContext } from './api';

let apiContext: APIRequestContext;
const sharedAuthTestUser = {
	username: '',
	password: 'Password1!'
};

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

test.beforeAll(async ({ playwright }) => {
	apiContext = await playwright.request.newContext({
		baseURL: API_BASE_URL + '/'
	});
	const chatApi = new ChatApiContext(apiContext);
	sharedAuthTestUser.username = getUniqueString('authTestUser');
	await chatApi.signUp({ ...sharedAuthTestUser, confirmPassword: sharedAuthTestUser.password });
});

test.afterAll(async () => {
	// Dispose all responses.
	await apiContext.dispose();
});

test('user is automatically redirected to the login page when not authenticated', async ({
	page
}) => {
	const authPage = new AuthPage(page);
	await page.goto('/');
	await authPage.verifyLoginPage();
});

test('user can create an account', async ({ page }) => {
	const authPage = new AuthPage(page);
	const newUser = {
		username: getUniqueString('newAuthTestUser'),
		password: 'abc123',
		confirmPassword: 'abc123'
	};
	await authPage.gotoSignUpPage();
	await authPage.createAccount(newUser);
	await authPage.verifyToast('User created!');
});

test('sign up form validation error message is shown if username already taken', async ({
	page
}) => {
	const authPage = new AuthPage(page);
	await authPage.gotoSignUpPage();
	await authPage.createAccount({
		...sharedAuthTestUser,
		confirmPassword: sharedAuthTestUser.password
	});
	await authPage.verifyInputErrorMessage(
		'Username',
		`Username "${sharedAuthTestUser.username}" already exists`
	);
});

test('sign up form validation error message if password and confirm password does not match', async ({
	page
}) => {
	const authPage = new AuthPage(page);
	const newUser = {
		username: getUniqueString('newAuthTestUser'),
		password: 'Password1!',
		confirmPassword: 'Password2@'
	};
	await authPage.gotoSignUpPage();
	await authPage.createAccount(newUser);
	await authPage.verifyInputErrorMessage(
		'Confirm Password',
		'Password and confirm password do not match'
	);
});

test('user can login and is redirected to default channel', async ({ page }) => {
	const authPage = new AuthPage(page);
	const chatPage = new ChatPage(page);
	await authPage.gotoLoginPage();
	await authPage.login(sharedAuthTestUser);
	await authPage.verifyToast('Logged in!');
	await chatPage.verifyCurrentlySelectedChannel('Welcome');
});

test('user cannot log in with incorrect credentials', async ({ page }) => {
	const authPage = new AuthPage(page);
	await authPage.gotoLoginPage();
	await authPage.login({ ...sharedAuthTestUser, password: 'wrongPassword' });
	await authPage.verifyToast('Invalid credentials');
});

test('user can logout and cannot navigate back to protected routes', async ({ page }) => {
	const authPage = new AuthPage(page);
	const chatPage = new ChatPage(page);
	await authPage.gotoLoginPage();
	await authPage.login(sharedAuthTestUser);
	await chatPage.verifyCurrentlySelectedChannel('Welcome');
	await chatPage.logout();
	await authPage.verifyLoginPage();
	await page.goto('/');
	await authPage.verifyLoginPage();
});
