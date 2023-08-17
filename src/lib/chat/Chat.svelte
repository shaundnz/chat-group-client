<script lang="ts">
	import Banner from './Banner.svelte';
	import Message from './Message.svelte';
	import TextInput from './TextInput.svelte';
	import { io } from 'socket.io-client';

	export let channelName: string;
	let messages: string[] = [];

	const socket = io('http://localhost:3000');
	const onSendClick = (message: string) => {
		messages = [...messages, message];
		socket.emit('events', message);
	};

	socket.on('update', ({ message }) => {
		console.log('Welcome room message received');
		messages = [...messages, message];
	});
</script>

<div class="flex flex-col h-screen overflow-hidden">
	<Banner {channelName} />
	<main class="flex flex-1 flex-col space-y-4 overflow-y-scroll px-4 [&>*:last-child]:pb-4">
		{#each messages as message}
			<Message userName="Shaunna Firth" {message} time="today at 1:29 PM" />
		{/each}
	</main>
	<div class="px-4 pb-4">
		<TextInput {onSendClick} />
	</div>
</div>
