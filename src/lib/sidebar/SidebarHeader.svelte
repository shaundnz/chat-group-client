<script lang="ts">
	export let headerText: string;
	export let onIconClick: () => void;
</script>

<div class="navbar shadow-lg flex space-x-2 pb-4">
	<div>
		<button class="btn btn-ghost btn-square text-xl font-semibold" on:click={onIconClick}>
			<slot name="icon" />
		</button>
	</div>
	<div class="text-xl font-semibold">
		<h2 class="w-60 text-ellipsis overflow-hidden whitespace-nowrap uppercase">
			{headerText}
		</h2>
	</div>
</div>
