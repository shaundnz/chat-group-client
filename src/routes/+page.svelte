<script lang="ts">
	import type { PageData } from './$types';
	import { socketStore } from '$lib/stores/socket';
	import { Chat, Sidebar } from '$lib';
	import { createChannelsContext } from '$lib/context/channelsContext';
	import LoadingOverlay from '$lib/components/common/LoadingOverlay.svelte';
	export let data: PageData;

	createChannelsContext(data.defaultChannel.id, data.channels);
</script>

{#if $socketStore.joinedChannelRooms}
	<LoadingOverlay />
{/if}
<Sidebar>
	<Chat />
</Sidebar>
