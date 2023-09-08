import {
	ChannelsContextMethods,
	type AuthStore,
	type ChannelsStore,
	type DerivedChannelsStore,
	AuthContextMethods
} from '$lib/context';
import { derived, writable, type Writable } from 'svelte/store';

export const setupMockChannelsContext = (initialState: ChannelsStore) => {
	const mockChannelsContextStore = writable<ChannelsStore>(initialState);

	const derivedChannelStore = derived<Writable<ChannelsStore>, DerivedChannelsStore>(
		mockChannelsContextStore,
		(state) => {
			const selectedChannel = state.channels.find(
				(channel) => channel.id === state.selectedChannelId
			);
			if (!selectedChannel) throw Error;
			return {
				...state,
				selectedChannel
			};
		}
	);

	const helper = new ChannelsContextMethods(mockChannelsContextStore.update);

	return { ...derivedChannelStore, helper: helper };
};

export const setupMockAuthContext = (initialState: AuthStore) => {
	const mockAuthStore = writable<AuthStore>(initialState);
	const helper = new AuthContextMethods(mockAuthStore.update);
	return { ...mockAuthStore, helper };
};
