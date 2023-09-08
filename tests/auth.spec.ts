import { expect, test } from '@playwright/test';
import { AuthPage } from './auth';
import { ChatPage } from './chat';

test('user is automatically redirected to the login page when not authenticated', async ({
	page
}) => {
	const authPage = new AuthPage(page);
	await page.goto('/');
	await authPage.verifyLoginPage();
});

test('user can create an account', async ({ page }) => {
	const authPage = new AuthPage(page);
	await authPage.gotoSignUpPage();
	await authPage.createAccount('userOne', 'Password1!', 'Password1!');
	await authPage.verifyToast('User created!');
});

test('sign up form validation error message is shown if username already taken', async ({
	page
}) => {
	const authPage = new AuthPage(page);
	await authPage.gotoSignUpPage();
	await authPage.createAccount('userOne', 'Password1!', 'Password1!');
	await authPage.verifyInputErrorMessage('Username', 'Username "userOne" already exists');
});

test('sign up form validation error message if password and confirm password does not match', async ({
	page
}) => {
	const authPage = new AuthPage(page);
	await authPage.gotoSignUpPage();
	await authPage.createAccount('userTwo', 'Password1!', 'Password2@');
	await authPage.verifyInputErrorMessage(
		'Confirm Password',
		'Password and confirm password do not match'
	);
});

test('user can login and is redirected to default channel', async ({ page }) => {
	const authPage = new AuthPage(page);
	const chatPage = new ChatPage(page);
	await authPage.gotoLoginPage();
	await authPage.login('userOne', 'Password1!');
	await authPage.verifyToast('Logged in!');
	await chatPage.verifyCurrentlySelectedChannel('Welcome');
});

test('user cannot log in with incorrect credentials', async ({ page }) => {
	const authPage = new AuthPage(page);
	await authPage.gotoLoginPage();
	await authPage.login('userOne', 'Password2@');
	await authPage.verifyToast('Invalid credentials');
});

test('user can logout and cannot navigate back to protected routes', async ({ page }) => {
	const authPage = new AuthPage(page);
	const chatPage = new ChatPage(page);
	await authPage.gotoLoginPage();
	await authPage.login('userOne', 'Password1!');
	await chatPage.verifyCurrentlySelectedChannel('Welcome');
	await chatPage.logout();
	await authPage.verifyLoginPage();
	await page.goto('/');
	await authPage.verifyLoginPage();
});
