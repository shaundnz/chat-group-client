<script lang="ts">
</script>

<form class="form-control max-w-md w-full">
	<h1 class="text-5xl font-semibold">Sign Up</h1>
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
	<label class="label" for="confirm-password">
		<span class="label-text"> Confirm Password: </span></label
	>
	<input
		type="password"
		placeholder="Confirm password"
		id="confirm-password"
		class="input input-bordered input-lg bg-neutral"
	/>
	<div class="pt-6">
		<button class="btn btn-primary w-full" type="submit">Login</button>
	</div>
	<div class="pt-1">
		Already have an account? Sign in <a
			href="/auth/login"
			class="link link-secondary"
			aria-label="Go to sign in page"
		>
			here!
		</a>
	</div>
</form>
