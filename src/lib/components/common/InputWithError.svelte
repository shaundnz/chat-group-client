<script lang="ts">
	import type { FormEventHandler } from 'svelte/elements';

	export let errors: string[] = [];
	export let value: string;
	export let labelText: string;
	export let controlId: string;
	export let password = false;

	const handleInput: FormEventHandler<HTMLInputElement> = (e) => {
		value = e.currentTarget.value;
	};
</script>

<label class="label" for={controlId}><span class="label-text">{labelText}:</span></label>
<input
	type={password ? 'password' : 'text'}
	placeholder={labelText}
	id={controlId}
	class={`input input-bordered input-lg bg-neutral ${errors.length && 'input-error'}`}
	required
	{value}
	on:input={handleInput}
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
