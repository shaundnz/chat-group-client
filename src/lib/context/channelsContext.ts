import { derived, writable, type Readable, type Writable, type Updater } from 'svelte/store';
import { getContext, setContext } from 'svelte';
import type { Channel, Message } from '$lib/types';
import type {
	ChannelCreatedEventResponseDto,
	CreateChannelDto,
	ReceivedMessageEventResponseDto,
	SendMessageEventRequestDto
} from '$lib/contracts';
import { ChannelsApi } from '$lib/api';
import { getSocket } from '$lib/stores/socket';

export interface ChannelsStore {
	socketConnectedToChannelRooms: boolean;
	selectedChannelId: string;
	channelsLoading: boolean;
	channels: Channel[];
}

export interface DerivedChannelsStore extends ChannelsStore {
	selectedChannel: Channel;
}

export const createChannelsContext = (defaultChannelId: string, channels: Channel[]) => {
	const initialState = {
		socketConnectedToChannelRooms: false,
		selectedChannelId: defaultChannelId,
		channelsLoading: false,
		channels: channels
	};

	const channelsStore = writable<ChannelsStore>(initialState);

	const derivedChannelStore = derived<Writable<ChannelsStore>, DerivedChannelsStore>(
		channelsStore,
		(state) => {
			const selectedChannel = state.channels.find(
				(channel) => channel.id === state.selectedChannelId
			);
			if (!selectedChannel) throw Error('Could not find channel');
			selectedChannel.messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
			return {
				...state,
				selectedChannel
			};
		}
	);

	const helper = new ChannelsContextMethods(channelsStore.update);

	setupChannelsContextSocketListeners(helper);

	setContext<Readable<DerivedChannelsStore> & { helper: ChannelsContextMethods }>(
		'channelsContext',
		{
			...derivedChannelStore,
			helper
		}
	);
};

export const getChannelsContext = () => {
	return getContext<Readable<DerivedChannelsStore> & { helper: ChannelsContextMethods }>(
		'channelsContext'
	);
};

export class ChannelsContextMethods {
	private readonly update: (this: void, updater: Updater<ChannelsStore>) => void;
	constructor(update: (this: void, updater: Updater<ChannelsStore>) => void) {
		this.update = update;
	}

	setChannelsLoadingState(loadingState: boolean) {
		this.update((state) => {
			state.channelsLoading = loadingState;
			return state;
		});
	}

	setSocketConnectedToChannelRoomsState(connected: boolean) {
		this.update((state) => {
			state.socketConnectedToChannelRooms = connected;
			return state;
		});
	}

	async fetchAndSetAllChannels() {
		const allChannels = await ChannelsApi.getAllChannels();
		this.update((state) => {
			state.channels = allChannels;
			return state;
		});
	}

	async createNewChannelAndSetActive(createChannelDto: CreateChannelDto) {
		this.setChannelsLoadingState(true);
		const newChannel = await ChannelsApi.createChannel(createChannelDto);
		this.update((state) => {
			state.channels.push(newChannel);
			state.selectedChannelId = newChannel.id;
			return state;
		});

		this.setChannelsLoadingState(false);
	}

	sendMessage(sendMessageEventRequestDto: SendMessageEventRequestDto) {
		const socket = getSocket();

		const newMessage: Message = {
			createdAt: new Date(),
			content: sendMessageEventRequestDto.content
		};

		socket.emit('message:send', sendMessageEventRequestDto);

		this.update((state) => {
			const selectedChannel = state.channels.find(
				(channel) => channel.id === sendMessageEventRequestDto.channelId
			);
			if (!selectedChannel) {
				// throw new Error('Could not find channel');
				return state;
			}
			selectedChannel.messages.push(newMessage);
			return state;
		});
	}

	setSelectedChannelId(selectedChannelId: string) {
		this.update((state) => {
			state.selectedChannelId = selectedChannelId;
			return state;
		});
	}

	pushMessageToChannel({ channelId, createdAt, content }: ReceivedMessageEventResponseDto) {
		this.update((state) => {
			const channelToUpdate = state.channels.find((channel) => channel.id === channelId);
			if (!channelToUpdate) {
				// throw new Error('Could not find channel');
				return state;
			}
			channelToUpdate.messages.push({ createdAt: new Date(createdAt), content });
			return state;
		});
	}
}

const setupChannelsContextSocketListeners = (helper: ChannelsContextMethods) => {
	const socket = getSocket();

	const receivedMessageCallback = (
		receivedMessageEventResponseDto: ReceivedMessageEventResponseDto
	) => {
		helper.pushMessageToChannel(receivedMessageEventResponseDto);
	};
	socket.on('message:received', receivedMessageCallback);

	const onChannelJoinedCallback = async () => {
		await helper.fetchAndSetAllChannels();
		helper.setSocketConnectedToChannelRoomsState(true);
	};

	socket.on('channels:joined', onChannelJoinedCallback);

	const onChannelCreatedCallback = async (
		channelCreatedEventResponseDto: ChannelCreatedEventResponseDto
	) => {
		await helper.fetchAndSetAllChannels();
	};

	socket.on('channel:created', onChannelCreatedCallback);
};
