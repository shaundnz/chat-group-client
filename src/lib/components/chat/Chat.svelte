<script lang="ts">
	import Banner from './Banner.svelte';
	import Message from './Message.svelte';
	import TextInput from './TextInput.svelte';
	import { getAuthContext, getChannelsContext } from '$lib/context';
	import { onMount } from 'svelte';
	import { error } from '@sveltejs/kit';

	let bottomOfChatWindow: HTMLDivElement;

	const channelsContext = getChannelsContext();
	const authContext = getAuthContext();
	$: ({ selectedChannelId, selectedChannel } = $channelsContext);
	$: ({ user } = $authContext);

	const scrollToBottom = () => {
		if (bottomOfChatWindow) {
			setTimeout(() => {
				bottomOfChatWindow.scrollIntoView({ behavior: 'smooth' });
			}, 10);
		}
	};

	$: selectedChannelId, scrollToBottom();

	const onSendClick = (messageContent: string) => {
		if (!user) throw error(401, 'You must be logged in to send a message');

		channelsContext.helper.sendMessage(
			{ channelId: selectedChannel.id, content: messageContent },
			user
		);
		scrollToBottom();
	};

	onMount(() => {
		scrollToBottom();
	});
</script>

<div class="flex flex-1 flex-col overflow-hidden h-screen">
	<Banner channelName={selectedChannel.title} />
	<main class="flex flex-1 flex-col space-y-4 overflow-y-scroll px-4">
		{#each selectedChannel.messages as message}
			<Message {message} />
		{/each}
		<div bind:this={bottomOfChatWindow} />
	</main>
	<div class="px-4 pb-4">
		<TextInput {onSendClick} />
	</div>
</div>
