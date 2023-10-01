import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { get, readable } from 'svelte/store';
import { getAuthToken } from './authToken';

interface SocketStore {
	socket: Socket;
}

export const socketStore = readable<SocketStore>(undefined, (set) => {
	const socket = io(`${import.meta.env.VITE_API_BASE_URL}`, {
		auth: (cb) => {
			cb({ token: getAuthToken() });
		}
	});
	set({ socket });

	return () => {
		socket.disconnect();
	};
});

export const getSocket = () => {
	const $store = get(socketStore);
	return $store.socket;
};
