<script lang="ts">
	import type { PageData } from './$types';
	import { socketStore } from '$lib/stores/socket';
	import { Chat, Sidebar } from '$lib';
	import { createChannelsContext, getChannelsContext } from '$lib/context/channelsContext';
	import LoadingOverlay from '$lib/components/common/LoadingOverlay.svelte';
	import { getAuthContext } from '$lib/context';
	import Redirect from '$lib/components/common/Redirect.svelte';
	export let data: PageData;

	$socketStore;

	createChannelsContext(data.defaultChannel.id, data.channels);

	const channelContext = getChannelsContext();
	const authContext = getAuthContext();
</script>

{#if $authContext.isUserLoggedIn}
	{#if !$channelContext.socketConnectedToChannelRooms}
		<LoadingOverlay />
	{/if}
	<Sidebar>
		<Chat />
	</Sidebar>
{:else}
	<Redirect url="/auth/login" />
{/if}
