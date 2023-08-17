import { writable, type Writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';
import type { Channel } from '$lib/types';

export interface ChannelsContext {
	selectedChannel: Channel | null;
	channels: Channel[];
}

const initialState = {
	selectedChannel: null,
	channels: [
		{
			channelName: 'Welcome',
			description: 'The welcome channel',
			members: ['User One', 'User Two']
		},
		{
			channelName: 'Front-End Developers',
			description: 'A channel to discuss front end development',
			members: ['User One', 'User Two', 'User Three']
		}
	]
};

export const createChannelsContext = () => {
	const channelsContext = writable<ChannelsContext>(initialState);
	setContext('channelsContext', channelsContext);
};

export const getChannelsContext = () => {
	return getContext<Writable<ChannelsContext>>('channelsContext');
};
