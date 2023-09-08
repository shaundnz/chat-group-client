<script lang="ts">
	export let errors: string[] = [];
	export let value: string;
	export let label: string;
</script>

<label class="label" for="username"><span class="label-text">{label}:</span></label>
<input
	type="text"
	placeholder="Username"
	id="username"
	class={`input input-bordered input-lg bg-neutral ${errors.length && 'input-error'}`}
	bind:value
/>
{#if errors.length}
	<label class="label" for="username">
		{#each errors as error}
			<div>
				<span class="label-text-alt text-error">{error}</span>
			</div>
		{/each}
	</label>
{/if}
