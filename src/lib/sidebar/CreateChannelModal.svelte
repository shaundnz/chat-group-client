<script lang="ts">
	import { getChannelsContext } from '$lib/context';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let form: HTMLFormElement;
	let title = '';
	let description = '';

	const channelsContext = getChannelsContext();

	const handleSubmit = async (e: SubmitEvent) => {
		try {
			await channelsContext.helper.createNewChannelAndSetActive({ title, description });
			dispatch('newChannelCreated');
			window.create_channel_modal.close();
			title = '';
			description = '';
		} catch {}
	};

	const handleTextAreaKeyPress = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			form.requestSubmit();
		}
	};
</script>

<dialog id="create_channel_modal" class="modal" data-testid="create-channel-modal">
	<div class="modal-box bg-base-200">
		<form method="dialog">
			<button class="btn btn-sm btn-square btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<form on:submit|preventDefault={handleSubmit} bind:this={form}>
			<div class="flex flex-col space-y-2">
				<h3 class="font-semibold text-xl">New Channel</h3>
				<div class="join join-vertical">
					<label for="title" class="label"><span class="label-text">Title</span></label>
					<input
						id="title"
						type="text"
						placeholder="Channel title"
						class="input w-full bg-neutral"
						required
						bind:value={title}
					/>
				</div>
				<div class="join join-vertical">
					<label for="description" class="label"><span class="label-text">Description</span></label>
					<textarea
						id="description"
						class="textarea resize-none flex-1 focus:outline-none bg-neutral w-full"
						placeholder="Channel description"
						required
						bind:value={description}
						on:keypress={handleTextAreaKeyPress}
					/>
				</div>
			</div>
			<div class="modal-action">
				<!-- if there is a button in form, it will close the modal -->
				<button class="btn btn-primary" type="submit">Save</button>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>Close</button>
	</form>
</dialog>
