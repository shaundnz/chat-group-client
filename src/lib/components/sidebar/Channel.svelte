<script lang="ts">
	import AcronymAvatar from '../common/AcronymAvatar.svelte';

	export let channelName: string;

	const getChannelAcronym = () => {
		return channelName
			.split(' ')
			.reduce((response, word) => (response += word.slice(0, 1)), '')
			.slice(0, 2)
			.toUpperCase();
	};
</script>

<button class="flex space-x-4 items-center hover:bg-neutral-focus rounded w-full" on:click>
	<AcronymAvatar name={channelName} />
	<div class="font-semibold text-lg text-left uppercase overflow-hidden overflow-ellipsis">
		{channelName}
	</div>
</button>
