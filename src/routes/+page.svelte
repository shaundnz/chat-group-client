<script lang="ts">
	import { Chat, Sidebar } from '$lib';
	import { createChannelsContext, getChannelsContext } from '$lib/context/channelsContext';
	import type { Channel } from '$lib/types';

	createChannelsContext();
</script>

<Sidebar>
	<Chat channelName="Hello World" />
</Sidebar>
