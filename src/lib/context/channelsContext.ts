import { writable, type Writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';
import type { Channel, CreateChannelDto } from '$lib/types';

export interface ChannelsContext {
	selectedChannel: Channel;
	channelsLoading: boolean;
	channels: Channel[];
}

export interface ChannelsContextFunctions {
	createChannelAndUpdateChannels: (createChannelDto: CreateChannelDto) => Promise<void>;
}

export const createChannelsContext = (defaultChannel: Channel, channels: Channel[]) => {
	const initialState = {
		selectedChannel: defaultChannel,
		channelsLoading: false,
		channels: channels
	};

	const { subscribe, update, set } = writable<ChannelsContext>(initialState);

	const setLoadingState = (loading: boolean) => {
		update((state) => {
			state.channelsLoading = loading;
			return state;
		});
	};

	const setAllChannels = async () => {
		const allChannelsRes = await fetch('http://localhost:3000/channels');

		const allChannelsJson: Channel[] = await allChannelsRes.json();
		update((state) => {
			state.channels = allChannelsJson.map((c) => ({ ...c, members: [] }));
			return state;
		});
	};

	const createChannelAndUpdateChannels = async (createChannelDto: CreateChannelDto) => {
		setLoadingState(true);
		const res = await fetch('http://localhost:3000/channels', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(createChannelDto)
		});

		const newChannelJson: Channel = await res.json();

		await setAllChannels();
		update((state) => {
			const newChannel = state.channels.find((channel) => channel.id === newChannelJson.id);
			// TODO: Should show some error state here
			if (!newChannel) {
				state.selectedChannel = newChannelJson;
				return state;
			}
			state.selectedChannel = newChannel;
			return state;
		});

		setLoadingState(false);
	};

	setContext('channelsContext', {
		subscribe,
		update,
		set,
		createChannelAndUpdateChannels
	});
};

export const getChannelsContext = () => {
	return getContext<Writable<ChannelsContext> & ChannelsContextFunctions>('channelsContext');
};
