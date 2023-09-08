<script lang="ts">
	import Redirect from '$lib/components/common/Redirect.svelte';
	import { getAuthContext } from '$lib/context';
	const authContext = getAuthContext();
</script>

{#if !$authContext.isUserLoggedIn}
	<div class="p-4 h-screen flex flex-col justify-center items-center text-center">
		<slot />
	</div>
{:else}
	<Redirect url="/" />
{/if}
