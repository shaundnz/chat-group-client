<script lang="ts">
</script>

<dialog id="create_channel_modal" class="modal">
	<form method="dialog" class="modal-box bg-base-200">
		<button class="btn btn-sm btn-square btn-ghost absolute right-2 top-2">✕</button>
		<div class="flex flex-col space-y-4">
			<h3 class="font-semibold text-xl">New Channel</h3>
			<input type="text" placeholder="Channel name" class="input w-full bg-neutral" required />
			<textarea
				class="textarea resize-none flex-1 focus:outline-none bg-neutral w-full"
				placeholder="Channel description"
				required
			/>
		</div>
		<div class="modal-action">
			<!-- if there is a button in form, it will close the modal -->
			<button class="btn btn-primary">Save</button>
		</div>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button>Close</button>
	</form>
</dialog>
