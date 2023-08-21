<script lang="ts">
	import type { PageData } from './$types';
	import { Chat, Sidebar } from '$lib';
	import { createChannelsContext } from '$lib/context/channelsContext';

	export let data: PageData;

	createChannelsContext(
		{
			id: 'f08693a5-e511-4a6f-88d5-3d108b31357b',
			title: 'Welcome',
			description: 'This is the default channel',
			members: []
		},
		data.channels
	);
</script>

<Sidebar>
	<Chat />
</Sidebar>
