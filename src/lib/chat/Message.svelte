<script lang="ts">
	export let message: string;
	export let userName: string;
	export let time: string;
</script>

<div class="flex space-x-4">
	<div class="avatar">
		<div class="w-12 h-12 rounded">
			<img src="/images/babyyoda.jpg" alt="avatar" />
		</div>
	</div>
	<div class="flex flex-col">
		<div class="flex space-x-4 items-center mb-1">
			<div class="font-semibold">
				{userName}
			</div>
			<div class="font-light text-sm">
				{time}
			</div>
		</div>
		<div>{message}</div>
	</div>
</div>
