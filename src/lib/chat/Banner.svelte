<script lang="ts">
	import MenuIcon from '~icons/mdi/menu';
	export let channelName: string;
</script>

<header class="navbar space-x-2 shadow-lg">
	<div>
		<label for="sidebar" class="btn btn-ghost btn-square lg:hidden">
			<MenuIcon class="text-xl font-semibold" />
			<span class="sr-only">Open sidebar</span>
		</label>
	</div>
	<div class="text-xl font-semibold uppercase">
		<h1>
			{channelName}
		</h1>
	</div>
</header>
