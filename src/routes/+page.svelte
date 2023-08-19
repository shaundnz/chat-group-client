<script lang="ts">
	import { Chat, Sidebar } from '$lib';
	import { createChannelsContext } from '$lib/context/channelsContext';

	createChannelsContext();
</script>

<Sidebar>
	<Chat channelName="Hello World" />
</Sidebar>
