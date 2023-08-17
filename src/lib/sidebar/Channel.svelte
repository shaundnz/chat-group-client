<script lang="ts">
	export let channelName: string;

	const getChannelAcronym = () => {
		return channelName
			.split(' ')
			.reduce((response, word) => (response += word.slice(0, 1)), '')
			.slice(0, 2)
			.toUpperCase();
	};
</script>

<button
	class="flex space-x-4 items-center hover:bg-neutral-focus rounded"
	on:click
	data-testid="channel-button"
>
	<div class="avatar placeholder">
		<div class="w-12 h-12 rounded bg-neutral-focus">
			<span class="text-lg font-semibold" aria-hidden="true">{getChannelAcronym()}</span>
		</div>
	</div>
	<div class="font-semibold text-lg text-left uppercase">{channelName}</div>
</button>
