<script lang="ts">
	import { default as dayjs } from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import type { Message as MessageType } from '$lib/types';
	import { onMount } from 'svelte';
	import AcronymAvatar from '../common/AcronymAvatar.svelte';
	export let message: MessageType;

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
	<AcronymAvatar name={message.user.username} userAvatar />
	<div class="flex flex-col">
		<div class="flex space-x-2 items-center mb-1">
			<div class="font-semibold">
				{message.user.username}
			</div>
			<div class="font-light text-sm">
				{relativeTimeString}
			</div>
		</div>
		<div>{message.content}</div>
	</div>
</div>
