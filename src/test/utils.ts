import type { ChannelsStore, DerivedChannelsStore } from '$lib/context';
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

	const setSelectedChannelId = (selectedChannelId: string) => {
		mockChannelsContextStore.update((state) => {
			state.selectedChannelId = selectedChannelId;
			return state;
		});
	};
	return { ...derivedChannelStore, setSelectedChannelId };
};
