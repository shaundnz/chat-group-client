<script lang="ts">
	import type { Channel } from '../../types';
	import HomeIcon from '~icons/mdi/Home';
	import GithubIcon from '~icons/mdi/Github';
	import LogoutIcon from '~icons/mdi/Logout';
	import Member from './Member.svelte';
	import SelectedChannel from './SelectedChannel.svelte';
	import AllChannels from './AllChannels.svelte';
	import { getAuthContext, getChannelsContext } from '$lib/context';
	import CreateChannelModal from './CreateChannelModal.svelte';

	const channelsContext = getChannelsContext();
	$: ({ selectedChannel, channels } = $channelsContext);

	const authContext = getAuthContext();

	let currentChannelView = false;

	const onBackButtonClick = () => {
		currentChannelView = false;
	};

	const onChannelClick = (channel: Channel) => {
		channelsContext.helper.setSelectedChannelId(channel.id);
		currentChannelView = true;
	};

	const handleNewChannelCreated = () => {
		currentChannelView = true;
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
		<div class="flex flex-1 flex-col h-full bg-base-200 w-80 overflow-hidden">
			{#if currentChannelView}
				<SelectedChannel {selectedChannel} {onBackButtonClick} />
			{:else}
				<AllChannels
					onCreateChannelButtonClick={() => window.create_channel_modal.showModal()}
					{onChannelClick}
					{channels}
				/>
			{/if}
			<div class="p-4 bg-base-300 flex justify-between items-center">
				<Member name={$authContext.user?.username} />

				<ul class="menu menu-horizontal p-0 [&>li>*]:px-2">
					<li>
						<a
							class="tooltip"
							href="https://shaundnz.com"
							target="_blank"
							data-tip="Go to shaundnz.com"
						>
							<HomeIcon class="text-xl" />
						</a>
					</li>
					<li>
						<a
							class="tooltip"
							href="https://github.com/shaundnz/chat-group-client"
							data-tip="View source code"
							target="_blank"
						>
							<GithubIcon class="text-xl" />
						</a>
					</li>
					<li>
						<button
							on:click={() => authContext.helper.logout()}
							class="tooltip"
							data-tip="Logout"
							data-testid="logout-button"
						>
							<LogoutIcon class="text-xl" />
						</button>
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
<CreateChannelModal on:newChannelCreated={handleNewChannelCreated} />
