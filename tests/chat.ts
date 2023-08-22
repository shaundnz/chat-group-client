import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class ChatPage {
	static async verifySidebarAllChannelsView(page: Page, allChannelTitles: string[]) {
		await expect(page.getByRole('heading', { level: 2, name: 'Channels' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Create channel' })).toBeVisible();
		const allChannelsListItems = page.getByTestId('all-channels-list').getByRole('listitem');
		await expect(allChannelsListItems).toHaveCount(allChannelTitles.length);
		await expect(allChannelsListItems).toContainText(allChannelTitles);
	}

	static async verifySidebarSingleChannelView(
		page: Page,
		{ title, description }: { title: string; description: string }
	) {
		await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 2, name: title })).toBeVisible();
		await expect(page.getByTestId('channel-description')).toContainText(description);
	}

	static async verifyCurrentlySelectedChannel(page: Page, selectedChannelTitle: string) {
		await expect(page.getByRole('heading', { level: 1, name: selectedChannelTitle })).toBeVisible();
	}

	static async verifyModalOpen(modal: Locator) {
		await expect(modal).toHaveAttribute('open', '');
	}

	static async verifyModalClosed(modal: Locator) {
		await expect(modal).not.toHaveAttribute('open', '');
	}
}
