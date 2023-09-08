import { AuthApi } from '$lib/api';
import type { LoginRequestDto, SignUpRequestDto } from '$lib/contracts';
import { getSocket } from '$lib/stores/socket';
import type { User } from '$lib/types';
import { errorToast } from '$lib/utils';
import { getContext, setContext } from 'svelte';
import { writable, type Updater, type Writable, derived, type Readable } from 'svelte/store';

export interface AuthStore {
	user: User | null;
}

export interface DerivedAuthStore extends AuthStore {
	isUserLoggedIn: boolean;
}

export const createAuthContext = (user: User | null) => {
	const initialState = {
		isUserLoggedIn: !!user,
		user: user
	};

	const authStore = writable<AuthStore>(initialState);

	const derivedAuthStore = derived<Writable<AuthStore>, DerivedAuthStore>(authStore, (state) => ({
		...state,
		isUserLoggedIn: !!state.user
	}));

	const helper = new AuthContextMethods(authStore.update);

	setupAuthContextSocketListeners(helper);

	setContext<Readable<DerivedAuthStore> & { helper: AuthContextMethods }>('authContext', {
		...derivedAuthStore,
		helper
	});
};

export const getAuthContext = () => {
	return getContext<Writable<DerivedAuthStore> & { helper: AuthContextMethods }>('authContext');
};

export class AuthContextMethods {
	private readonly update: (this: void, updater: Updater<AuthStore>) => void;
	constructor(update: (this: void, updater: Updater<AuthStore>) => void) {
		this.update = update;
	}

	async signUp(signUpRequestDto: SignUpRequestDto): Promise<User> {
		const newUser = await AuthApi.signUp(signUpRequestDto);
		return newUser;
	}

	async login(loginRequestDto: LoginRequestDto) {
		const loginRes = await AuthApi.login(loginRequestDto);
		localStorage.setItem('Authorization', loginRes.accessToken);
		this.update((state) => {
			state.user = { username: loginRes.user.username };
			return state;
		});
	}

	logout() {
		localStorage.removeItem('Authorization');
		this.update((state) => {
			state.user = null;
			return state;
		});
	}

	async attemptToSetLoggedInUser(): Promise<User> {
		const user = await AuthApi.getLoggedInUser();
		this.update((state) => {
			state.user = user;
			return state;
		});
		return user;
	}
}

const setupAuthContextSocketListeners = (helper: AuthContextMethods) => {
	const socket = getSocket();

	const onConnectErrorCallback = ({ message }: { message: string }) => {
		if (message === 'FORBIDDEN') {
			helper.logout();
			errorToast('Error connecting socket, please try login again');
		}
	};

	socket.on('connect_error', onConnectErrorCallback);
};
