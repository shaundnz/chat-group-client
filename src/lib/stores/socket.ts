import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { get, readable } from 'svelte/store';

interface SocketStore {
	socket: Socket;
	joinedChannelRooms: boolean;
}

export const socketStore = readable<SocketStore>(undefined, (set) => {
	const socket = io('http://localhost:3000');
	socket.on('channels:join', () => {
		set({ socket: socket, joinedChannelRooms: true });
	});

	set({ socket: socket, joinedChannelRooms: false });
	return () => {
		socket.disconnect();
	};
});

export const getSocket = () => {
	const $store = get(socketStore);
	return $store.socket;
};

export const getIsJoinedChannelRooms = () => {
	const $store = get(socketStore);
	return $store.joinedChannelRooms;
};
