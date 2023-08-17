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
<div class="flex flex-col flex-1 space-y-4 overflow-y-scroll px-4">
	{#each channels as channel}
		<Channel channelName={channel.channelName} on:click={() => onChannelClick(channel)} />
	{/each}
</div>
