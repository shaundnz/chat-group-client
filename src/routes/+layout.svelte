<script lang="ts">
	import '../app.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { createAuthContext } from '$lib/context/authContext';
	import { HttpError } from '$lib/api';
	import { errorToast } from '$lib/utils';
	import type { PageData } from './$types';
	export let data: PageData;

	createAuthContext(data.user);

	const handleError = (err: Error) => {
		if (err instanceof HttpError) {
			if (err.statusCode === 401) {
				errorToast('Authentication error');
			}
		}
	};
</script>

<svelte:window on:unhandledrejection|capture={(e) => handleError(e.reason)} />
<slot />
<SvelteToast />
