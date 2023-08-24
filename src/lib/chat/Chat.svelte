<script lang="ts">
	import Banner from './Banner.svelte';
	import Message from './Message.svelte';
	import TextInput from './TextInput.svelte';
	import { getChannelsContext } from '$lib/context';

	const channelsContext = getChannelsContext();
	$: ({ selectedChannel } = $channelsContext);

	const onSendClick = (message: string) => {
		channelsContext.sendMessage(selectedChannel.id, message);
	};
</script>

<div class="flex flex-col h-screen overflow-hidden">
	<Banner channelName={selectedChannel.title} />
	<main class="flex flex-1 flex-col space-y-4 overflow-y-scroll px-4 [&>*:last-child]:pb-4">
		{#each selectedChannel.messages as message}
			<Message userName="Anonymous User" {message} time="today at 1:29 PM" />
		{/each}
	</main>
	<div class="px-4 pb-4">
		<TextInput {onSendClick} />
	</div>
</div>
