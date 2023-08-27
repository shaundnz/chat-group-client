import {
	ChannelsContextMethods,
	type ChannelsStore,
	type DerivedChannelsStore
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
