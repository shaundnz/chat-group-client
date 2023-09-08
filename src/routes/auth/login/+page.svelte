<script lang="ts">
	import { getAuthContext } from '$lib/context';
	import { errorToast, successToast } from '$lib/utils';
	const authContext = getAuthContext();

	let username = '';
	let password = '';

	const handleSubmit = async () => {
		try {
			await authContext.helper.login({ username, password });
			successToast('Logged in!');
		} catch {
			errorToast('Invalid credentials');
		}
	};
</script>

<form class="form-control max-w-md w-full" on:submit|preventDefault={handleSubmit}>
	<h1 class="text-5xl font-semibold uppercase">Login</h1>
	<label class="label" for="username"><span class="label-text">Username:</span></label>
	<input
		type="text"
		placeholder="Username"
		id="username"
		class="input input-bordered input-lg bg-neutral"
		required
		bind:value={username}
	/>
	<label class="label" for="password"> <span class="label-text"> Password: </span></label>
	<input
		type="password"
		placeholder="Password"
		id="password"
		class="input input-bordered input-lg bg-neutral"
		required
		bind:value={password}
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
