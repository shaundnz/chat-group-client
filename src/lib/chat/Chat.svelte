<script lang="ts">
	import Banner from './Banner.svelte';
	import Message from './Message.svelte';
	import TextInput from './TextInput.svelte';
	import { getChannelsContext } from '$lib/context';
	import { onMount } from 'svelte';

	let bottomOfChatWindow: HTMLDivElement;

	const channelsContext = getChannelsContext();
	$: ({ selectedChannelId, selectedChannel } = $channelsContext);

	const scrollToBottom = () => {
		if (bottomOfChatWindow) {
			setTimeout(() => {
				bottomOfChatWindow.scrollIntoView({ behavior: 'smooth' });
			}, 10);
		}
	};

	$: selectedChannelId, scrollToBottom();

	const onSendClick = (messageContent: string) => {
		channelsContext.sendMessage({ channelId: selectedChannel.id, content: messageContent });
		scrollToBottom();
	};

	onMount(() => {
		scrollToBottom();
	});
</script>

<div class="flex flex-col h-screen overflow-hidden">
	<Banner channelName={selectedChannel.title} />
	<main class="flex flex-1 flex-col space-y-4 overflow-y-scroll px-4">
		{#each selectedChannel.messages as message}
			<Message userName="Anonymous User" {message} />
		{/each}
		<div bind:this={bottomOfChatWindow} />
	</main>
	<div class="px-4 pb-4">
		<TextInput {onSendClick} />
	</div>
</div>
