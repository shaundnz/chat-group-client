<script lang="ts">
	import SendIcon from '~icons/mdi/send';
	export let onSendClick: (message: string) => void;

	let form: HTMLFormElement;
	let message = '';

	const submitMessageHandler = () => {
		onSendClick(message);
		message = '';
	};

	const handleTextAreaKeyPress = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			form.requestSubmit();
		}
	};
</script>

<form
	id="sendMessageForm"
	class="flex p-2 rounded-xl items-center bg-neutral space-x-2"
	on:submit|preventDefault={submitMessageHandler}
	bind:this={form}
>
	<textarea
		class="textarea bg-transparent resize-none flex-1 focus:outline-none"
		placeholder="Type a message here"
		required
		bind:value={message}
		on:keypress={handleTextAreaKeyPress}
	/>
	<div>
		<button class="btn btn-primary btn-square" type="submit">
			<SendIcon />
			<span class="sr-only">Send message</span>
		</button>
	</div>
</form>
