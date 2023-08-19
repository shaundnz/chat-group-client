<script lang="ts">
	import type { PageData } from './$types';
	import { Chat, Sidebar } from '$lib';
	import { createChannelsContext } from '$lib/context/channelsContext';

	export let data: PageData;

	createChannelsContext(data.channels);
</script>

<Sidebar>
	<Chat channelName="Hello World" />
</Sidebar>
