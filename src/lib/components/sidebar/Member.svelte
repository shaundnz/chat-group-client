<script lang="ts">
	export let name: string;
</script>

<div class="flex space-x-4 items-center" data-testid="member">
	<div class="avatar">
		<div class="w-12 h-12 rounded">
			<img src="/images/babyyoda.jpg" alt="avatar" />
		</div>
	</div>
	<div class="font-semibold text-lg">{name}</div>
</div>
