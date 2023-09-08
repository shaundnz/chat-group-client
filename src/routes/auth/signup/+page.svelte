<script lang="ts">
	import { HttpError } from '$lib/api';
	import { getAuthContext } from '$lib/context';
	import { successToast } from '$lib/utils';
	import type { SignUpBadRequestDto } from '$lib/contracts';
	import InputWithError from '$lib/components/common/InputWithError.svelte';

	$: username = '';
	let password = '';
	let confirmPassword = '';

	const errors = {
		username: [] as string[],
		password: [] as string[],
		confirmPassword: [] as string[]
	};

	const authContext = getAuthContext();

	const handleSubmit = async () => {
		errors.username = [];
		errors.password = [];
		errors.confirmPassword = [];
		try {
			if (password !== confirmPassword) {
				errors.confirmPassword = ['Password and confirm password do not match'];
				return;
			}

			await authContext.helper.signUp({ username, password, confirmPassword });
			successToast('User created!');
		} catch (err) {
			if (err instanceof HttpError) {
				const badRequestError = err as SignUpBadRequestDto;

				badRequestError.message.forEach((m) => {
					switch (m.property) {
						case 'username':
							errors.username = [...errors.username, m.error];
							break;
						case 'password':
							errors.password = [...errors.password, m.error];
							break;
						case 'confirmPassword':
							errors.confirmPassword = [...errors.confirmPassword, m.error];
							break;
						default:
							break;
					}
				});
			}
		}
	};
</script>

<form class="form-control max-w-md w-full" on:submit|preventDefault={handleSubmit}>
	<h1 class="text-5xl font-semibold uppercase">Sign Up</h1>
	<InputWithError
		labelText="Username"
		controlId="username"
		errors={errors.username}
		bind:value={username}
	/>
	<InputWithError
		labelText="Password"
		controlId="password"
		password
		errors={errors.password}
		bind:value={password}
	/>
	<InputWithError
		labelText="Confirm Password"
		controlId="confirm-password"
		password
		errors={errors.confirmPassword}
		bind:value={confirmPassword}
	/>

	<div class="pt-6">
		<button class="btn btn-primary w-full" type="submit">Sign Up</button>
	</div>
	<div class="pt-1">
		Already have an account? Login <a
			href="/auth/login"
			class="link link-secondary"
			aria-label="Go to sign in page"
		>
			here!
		</a>
	</div>
</form>
