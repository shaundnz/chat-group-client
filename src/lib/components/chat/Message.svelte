<script lang="ts">
	import { default as dayjs } from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import type { Message as MessageType } from '$lib/types';
	import { onMount } from 'svelte';
	export let message: MessageType;
	export let userName: string;

	dayjs.extend(relativeTime);

	$: relativeTimeString = dayjs(message.createdAt).fromNow();

	onMount(() => {
		const interval = setInterval(() => {
			relativeTimeString = dayjs(message.createdAt).fromNow();
		}, 10000);
		return () => clearInterval(interval);
	});
</script>

<div class="flex space-x-4" data-testid="message">
	<div class="avatar">
		<div class="w-12 h-12 rounded">
			<img src="/images/babyyoda.jpg" alt="avatar" />
		</div>
	</div>
	<div class="flex flex-col">
		<div class="flex space-x-2 items-center mb-1">
			<div class="font-semibold">
				{userName}
			</div>
			<div class="font-light text-sm">
				{relativeTimeString}
			</div>
		</div>
		<div>{message.content}</div>
	</div>
</div>
