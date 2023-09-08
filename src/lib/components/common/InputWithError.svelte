<script lang="ts">
	export let errors: string[] = [];
	export let value: string;
	export let labelText: string;
	export let controlId: string;
</script>

<label class="label" for={controlId}><span class="label-text">{labelText}:</span></label>
<input
	type="text"
	placeholder={labelText}
	id={controlId}
	class={`input input-bordered input-lg bg-neutral ${errors.length && 'input-error'}`}
	required
	bind:value
/>
{#if errors.length}
	<label class="label" for={controlId}>
		{#each errors as error}
			<div>
				<span class="label-text-alt text-error">{error}</span>
			</div>
		{/each}
	</label>
{/if}
