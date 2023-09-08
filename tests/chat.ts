import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export class ChatPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	getModal() {
		return this.page.getByTestId('create-channel-modal');
	}

	async goToChannel(title: string) {
		const backButton = this.page.getByRole('button', { name: 'Back' });
		if ((await backButton.count()) === 1) {
			await backButton.click();
		}
		await expect(this.page.getByRole('heading', { level: 2, name: 'Channels' })).toBeVisible();
		const allChannelsList = this.page.getByTestId('all-channels-list');
		await allChannelsList.getByRole('button', { name: title }).click();
		await expect(this.page.getByRole('heading', { level: 2, name: title })).toBeVisible();
	}

	async verifySidebarAllChannelsView(allChannelTitles: string[]) {
		await expect(this.page.getByRole('heading', { level: 2, name: 'Channels' })).toBeVisible();
		await expect(this.page.getByRole('button', { name: 'Create channel' })).toBeVisible();
		const allChannelsListItems = this.page.getByTestId('all-channels-list').getByRole('listitem');
		await expect(allChannelsListItems).toHaveCount(allChannelTitles.length);
		await expect(allChannelsListItems).toContainText(allChannelTitles);
	}

	async verifySidebarSingleChannelView({
		title,
		description
	}: {
		title: string;
		description: string;
	}) {
		await expect(this.page.getByRole('button', { name: 'Back' })).toBeVisible();
		await expect(this.page.getByRole('heading', { level: 2, name: title })).toBeVisible();
		await expect(this.page.getByTestId('channel-description')).toContainText(description);
	}

	async verifyCurrentlySelectedChannel(selectedChannelTitle: string) {
		await expect(
			this.page.getByRole('heading', { level: 1, name: selectedChannelTitle })
		).toBeVisible();
	}

	async verifyModalOpen() {
		await expect(this.getModal()).toHaveAttribute('open', '');
	}

	async verifyModalClosed() {
		await expect(this.getModal()).not.toHaveAttribute('open', '');
	}

	async sendMessage(content: string) {
		await this.page.getByRole('textbox', { name: 'Type a message here' }).fill(content);
		await this.page.getByRole('button', { name: 'Send message' }).click();
	}

	async verifyLastMessage(content: string) {
		await expect(this.page.getByTestId('message').last()).toContainText(content);
	}

	async verifyAllMessages(allMessageContents: string[]) {
		const currentChannelMessages = this.page.getByTestId('message');
		await expect(currentChannelMessages).toHaveCount(allMessageContents.length);
		await expect(currentChannelMessages).toContainText(allMessageContents);
	}

	async waitForPageLoad() {
		await expect(this.page.getByText('Connecting to channels')).not.toBeAttached();
	}

	async logout() {
		await this.page.getByRole('button', { name: 'Logout' }).click();
	}
}
