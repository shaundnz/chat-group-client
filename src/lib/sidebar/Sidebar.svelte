<script lang="ts">
	import type { Channel } from '../types';
	import Member from './Member.svelte';
	import SelectedChannel from './SelectedChannel.svelte';
	import AllChannels from './AllChannels.svelte';
	import { getChannelsContext } from '$lib/context';

	const channelsContext = getChannelsContext();
	$: ({ selectedChannel, channels } = $channelsContext);

	const handleBackButtonClick = () => {
		selectedChannel = null;
	};

	const handleChannelClick = (channel: Channel) => {
		selectedChannel = channel;
	};
</script>

<div class="drawer lg:drawer-open">
	<input id="sidebar" type="checkbox" class="drawer-toggle" />
	<!-- Page content here -->
	<div class="drawer-content">
		<slot />
	</div>

	<div class="drawer-side">
		<label for="sidebar" class="drawer-overlay" />
		<div class="flex flex-1 flex-col h-screen bg-base-200 w-80 overflow-hidden">
			{#if selectedChannel}
				<SelectedChannel {selectedChannel} onBackButtonClick={handleBackButtonClick} />
			{:else}
				<AllChannels
					onCreateChannelButtonClick={() => window.create_channel_modal.showModal()}
					onChannelClick={handleChannelClick}
					{channels}
				/>
			{/if}
			<div class="p-4 bg-base-300"><Member name="Shaun Price (You)" /></div>
		</div>
	</div>
</div>
<dialog id="create_channel_modal" class="modal">
	<form method="dialog" class="modal-box bg-base-200">
		<button class="btn btn-sm btn-square btn-ghost absolute right-2 top-2">✕</button>
		<div class="flex flex-col space-y-4">
			<h3 class="font-semibold text-xl">New Channel</h3>
			<input type="text" placeholder="Channel name" class="input w-full bg-neutral" />
			<textarea
				class="textarea resize-none flex-1 focus:outline-none bg-neutral w-full"
				placeholder="Channel description"
			/>
		</div>
		<div class="modal-action">
			<!-- if there is a button in form, it will close the modal -->
			<button class="btn btn-primary">Save</button>
		</div>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button>Close</button>
	</form>
</dialog>
