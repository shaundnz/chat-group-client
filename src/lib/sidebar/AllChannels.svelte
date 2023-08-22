<script lang="ts">
	import PlusIcon from '~icons/mdi/plus-thick';
	import SidebarHeader from './SidebarHeader.svelte';
	import Channel from './Channel.svelte';
	import type { Channel as ChannelType } from '../types';

	export let onCreateChannelButtonClick: () => void;
	export let onChannelClick: (channel: ChannelType) => void;
	export let channels: ChannelType[];
</script>

<SidebarHeader headerText={'Channels'} onIconClick={onCreateChannelButtonClick}>
	<span slot="icon">
		<PlusIcon />
		<span class="sr-only">Create channel</span>
	</span>
</SidebarHeader>
<div class="px-4 pb-4">
	<input type="text" placeholder="Search" class="input w-full bg-neutral" />
</div>
<ul class="flex flex-col flex-1 space-y-4 overflow-y-auto px-4" data-testid="all-channels-list">
	{#each channels as channel}
		<li>
			<Channel channelName={channel.title} on:click={() => onChannelClick(channel)} />
		</li>
	{/each}
</ul>
