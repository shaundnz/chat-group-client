<script lang="ts">
	import type { Message as MessageType } from '$lib/types';
	export let message: MessageType;
	export let userName: string;
</script>

<div class="flex space-x-4" data-testid="message">
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
				{message.createdAt}
			</div>
		</div>
		<div>{message.content}</div>
	</div>
</div>
