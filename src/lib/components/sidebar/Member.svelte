<script lang="ts">
	import AcronymAvatar from '../common/AcronymAvatar.svelte';
	export let name = '';
</script>

<div class="flex space-x-4 items-center" data-testid="member">
	<AcronymAvatar {name} userAvatar />
	<div class="font-semibold text-lg">{name}</div>
</div>
