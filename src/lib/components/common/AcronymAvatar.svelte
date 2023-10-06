<script lang="ts">
	export let name = '';
	export let userAvatar = false;

	const getAcronym = () =>
		name
			.split(' ')
			.reduce((response, word) => (response += word.slice(0, 1)), '')
			.slice(0, 2)
			.toUpperCase();
</script>

<div class="avatar placeholder">
	<div
		class={`w-12 h-12 ${
			userAvatar ? 'rounded-full text-accent-focus' : 'rounded'
		} bg-neutral-focus `}
	>
		<span class="text-lg font-semibold" aria-hidden="true">{getAcronym()}</span>
	</div>
</div>
