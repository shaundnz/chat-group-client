import type { LoginRequestDto, SignUpRequestDto } from '$lib/contracts';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export class AuthPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async gotoSignUpPage() {
		await this.page.goto('/auth/signup');
		await this.verifySignUpPage();
	}

	async gotoLoginPage() {
		await this.page.goto('/auth/login');
		await this.verifyLoginPage();
	}

	async verifySignUpPage() {
		await expect(this.page.getByRole('heading', { level: 1, name: 'Sign Up' })).toBeVisible();
	}

	async verifyLoginPage() {
		await expect(this.page.getByRole('heading', { level: 1, name: 'Login' })).toBeVisible();
	}

	async verifyToast(toastMessage: string) {
		await expect(this.page.getByRole('status')).toContainText(toastMessage);
	}

	async verifyInputErrorMessage(label: string, errorMessage: string) {
		await expect(this.page.getByLabel(label)).toHaveClass(/input-error/);
		await expect(this.page.getByText(errorMessage)).toBeVisible();
		await expect(this.page.getByText(errorMessage)).toHaveClass(/text-error/);
	}

	async createAccount({ username, password, confirmPassword }: SignUpRequestDto) {
		await this.page.getByLabel('Username:').fill(username);
		await this.page.getByLabel('Password:', { exact: true }).fill(password);
		await this.page.getByLabel('Confirm Password:').fill(confirmPassword);
		await this.page.getByRole('button', { name: 'Sign Up' }).click();
	}

	async login({ username, password }: LoginRequestDto) {
		await this.page.getByLabel('username').fill(username);
		await this.page.getByLabel('password').fill(password);
		await this.page.getByRole('button', { name: 'Login' }).click();
	}
}
