<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let url = '/';

	onMount(() => {
		goto(url);
	});
</script>
