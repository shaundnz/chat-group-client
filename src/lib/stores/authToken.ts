import { browser } from '$app/environment';
import { persisted } from 'svelte-local-storage-store';
import { get } from 'svelte/store';

// First param `Authorization` is the local storage key.
// Second param is the initial value.
export const authTokenStore = persisted('Authorization', '');

export const getAuthToken = () => {
	return get(authTokenStore);
};

export const setAuthToken = (token: string) => {
	authTokenStore.set(token);
};

export const clearAuthToken = () => {
	authTokenStore.set('');
	if (browser) {
		localStorage.removeItem('Authorization');
	}
};
