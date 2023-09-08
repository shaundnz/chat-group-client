import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { get, readable } from 'svelte/store';

interface SocketStore {
	socket: Socket;
}

export const socketStore = readable<SocketStore>(undefined, (set) => {
	const socket = io('http://localhost:3000', {
		auth: (cb) => {
			cb({ token: localStorage.getItem('Authorization') });
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
