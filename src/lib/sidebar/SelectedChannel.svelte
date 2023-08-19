<script lang="ts">
	import ArrowLeftIcon from '~icons/mdi/arrow-left';
	import type { Channel } from '../types';
	import Member from './Member.svelte';
	import SidebarHeader from './SidebarHeader.svelte';

	export let selectedChannel: Channel;
	export let onBackButtonClick: () => void;
</script>

<SidebarHeader headerText={selectedChannel.title} onIconClick={onBackButtonClick}>
	<span slot="icon">
		<ArrowLeftIcon />
		<span class="sr-only">Back</span>
	</span>
</SidebarHeader>
<div class="px-4">
	<div class="space-y-1">
		<p>
			{selectedChannel.description}
		</p>
	</div>
</div>
<div class="text-xl font-semibold px-4 pt-4 pb-2">
	<h2>MEMBERS</h2>
</div>
<div class="flex flex-col flex-1 space-y-4 overflow-y-scroll px-4">
	{#each selectedChannel.members as member}
		<Member name={member} />
	{/each}
</div>
