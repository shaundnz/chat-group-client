<script lang="ts">
	import Banner from './Banner.svelte';
	import Message from './Message.svelte';
	import TextInput from './TextInput.svelte';
	import { getChannelsContext } from '$lib/context';

	const channelsContext = getChannelsContext();
	$: ({ selectedChannel } = $channelsContext);

	const onSendClick = (messageContent: string) => {
		channelsContext.sendMessage(selectedChannel.id, messageContent);
	};
</script>

<div class="flex flex-col h-screen overflow-hidden">
	<Banner channelName={selectedChannel.title} />
	<main class="flex flex-1 flex-col space-y-4 overflow-y-scroll px-4 [&>*:last-child]:pb-4">
		{#each selectedChannel.messages as message}
			<Message userName="Anonymous User" {message} />
		{/each}
	</main>
	<div class="px-4 pb-4">
		<TextInput {onSendClick} />
	</div>
</div>
