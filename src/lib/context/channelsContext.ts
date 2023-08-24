import { derived, writable, type Readable, type Writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';
import type { Channel, ChannelDto, CreateChannelDto } from '$lib/types';
import { io } from 'socket.io-client';

export interface ChannelsStore {
	selectedChannelId: string;
	channelsLoading: boolean;
	channels: Channel[];
}

export interface DerivedChannelsStore extends ChannelsStore {
	selectedChannel: Channel;
}

export interface ChannelsContextFunctions {
	createChannelAndUpdateChannels: (createChannelDto: CreateChannelDto) => Promise<void>;
	sendMessage: (channelId: string, message: string) => void;
	setSelectedChannelId: (selectedChannelId: string) => void;
}

export const createChannelsContext = (defaultChannelId: string, channels: Channel[]) => {
	const initialState = {
		selectedChannelId: defaultChannelId,
		channelsLoading: false,
		channels: channels
	};

	const channelsStore = writable<ChannelsStore>(initialState);
	const { update } = channelsStore;

	const derivedChannelStore = derived<Writable<ChannelsStore>, DerivedChannelsStore>(
		channelsStore,
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

	// Connect to the server, user joins all channel rooms
	const socket = io('http://localhost:3000');
	const sendMessage = (channelId: string, content: string) => {
		socket.emit('message:send', { channelId, content });
		update((state) => {
			const selectedChannel = state.channels.find((channel) => channel.id === channelId);
			if (!selectedChannel) {
				throw new Error('Could not find channel');
			}
			selectedChannel.messages.push(content);
			return state;
		});
	};

	socket.on(
		'message:received',
		({ channelId, message }: { channelId: string; message: string }) => {
			update((state) => {
				const channelToUpdate = state.channels.find((channel) => channel.id === channelId);
				if (!channelToUpdate) {
					throw new Error('Could not find channel');
				}
				channelToUpdate.messages.push(message);
				return state;
			});
		}
	);

	const setLoadingState = (loading: boolean) => {
		update((state) => {
			state.channelsLoading = loading;
			return state;
		});
	};

	const setAllChannels = async () => {
		const allChannelsRes = await fetch('http://localhost:3000/channels');

		const allChannelsJson: ChannelDto[] = await allChannelsRes.json();
		update((state) => {
			state.channels = allChannelsJson.map((c) => ({ ...c, members: [], messages: [] }));
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

		const newChannelJson: ChannelDto = await res.json();

		await setAllChannels();
		update((state) => {
			const newChannel = state.channels.find((channel) => channel.id === newChannelJson.id);
			// TODO: Should show some error state here
			if (!newChannel) {
				throw new Error('Could not find channel');
			}
			state.selectedChannelId = newChannel.id;
			return state;
		});

		setLoadingState(false);
	};

	const setSelectedChannelId = (selectedChannelId: string) => {
		update((state) => {
			state.selectedChannelId = selectedChannelId;
			return state;
		});
	};

	setContext('channelsContext', {
		...derivedChannelStore,
		createChannelAndUpdateChannels,
		sendMessage,
		setSelectedChannelId
	});
};

export const getChannelsContext = () => {
	return getContext<Readable<DerivedChannelsStore> & ChannelsContextFunctions>('channelsContext');
};
