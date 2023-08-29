<script lang="ts">
</script>

<form class="form-control max-w-md w-full">
	<h1 class="text-5xl font-semibold">Login</h1>
	<label class="label" for="username"><span class="label-text">Username:</span></label>
	<input
		type="text"
		placeholder="Username"
		id="username"
		class="input input-bordered input-lg bg-neutral"
	/>
	<label class="label" for="password"> <span class="label-text"> Password: </span></label>
	<input
		type="password"
		placeholder="Password"
		id="password"
		class="input input-bordered input-lg bg-neutral"
	/>
	<div class="pt-6">
		<button class="btn btn-primary w-full" type="submit">Login</button>
	</div>
	<div class="pt-1">
		Don't have an account? Sign up <a
			href="/auth/signup"
			class="link link-secondary"
			aria-label="Go to sign up page"
		>
			here!
		</a>
	</div>
</form>
