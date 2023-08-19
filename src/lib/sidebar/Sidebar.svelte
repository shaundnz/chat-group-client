<script lang="ts">
	import type { Channel } from '../types';
	import Member from './Member.svelte';
	import SelectedChannel from './SelectedChannel.svelte';
	import AllChannels from './AllChannels.svelte';
	import { getChannelsContext } from '$lib/context';
	import CreateChannelModal from './CreateChannelModal.svelte';

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
<CreateChannelModal />
