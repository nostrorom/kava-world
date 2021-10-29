<script>
	import { onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';
	import Button from '$lib/UI/Button.svelte';
	import Icon from '$lib/UI/Icon.svelte';
	import Spinner from '$lib/UI/Spinner.svelte';
	import { user, visitor, user_data } from '../stores/user';
    import { goto } from '$app/navigation';

	const URL = 'https://kava-world-api.herokuapp.com/';

	let formType = 'login';
	let passwordInput;
	let confirmPasswordInput;
	let showResetPassword = false;

	let requesting = false;
	let sending = false;

	let success = '';
	const errors = {
		email: '',
		password: '',
		username: ''
	};

	// Form type

	const formLogin = () => {
		clearMessages();
    formType = 'login';
	};

	const formSignup = () => {
		clearMessages();
    formType = 'signup';
	};

	// Show & hide passwords

	// const select = () => {
	// 	confirmPasswordInput = document.getElementById('confirmPassword');
	// };

	$: if (typeof window !== 'undefined') {
		passwordInput = document.getElementById('password');
	}

	const showPassword = () => {
		passwordInput.type = 'text';
	};

	const hidePassword = () => {
		passwordInput.type = 'password';
	};

	$: if ($visitor.confirmPassword !== '') {
		confirmPasswordInput = document.getElementById('confirmPassword');
	}

	const showConfirmPassword = () => {
		confirmPasswordInput.type = 'text';
	};

	const hideConfirmPassword = () => {
		confirmPasswordInput.type = 'password';
	};

	const toggleReset = () => {
		showResetPassword = !showResetPassword;
	};

	// Check username availability & clear messages

	onMount(async () => {
		if ($user_data.length === 0) {
			console.log('user fetch');

			const res = await fetch(`${URL}` + `users`);
			user_data.set(await res.json());

			// console.log('😶', $user_data);
		}
	});

	$: errors.username = $user_data.some(
		(user) => user.username.toLowerCase() === $visitor.username.toLowerCase()
	)
		? 'Username already taken, please choose another one'
		: '';

	const clearMessages = () => {
		errors.email = '';
		errors.username = '';
		errors.password = '';
		success = '';
	};

    const logout = () => {
        user.set({})
    }

	// Server requests

	const login = async () => {
		clearMessages();
		requesting = true;

		const res = await fetch(`${URL}` + `login`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				email: $visitor.email,
				password: $visitor.password
			})
		});

		const data = await res.json();

		if (!res.ok) {
			errors.email = data.errors.email;
			errors.password = data.errors.password;
		} else {
			user.set({
				_id: data._id,
				username: data.username,
				jwt: data.jwt
			});
			setTimeout(() => {
				goto('/');
			}, 1500);
		}
		requesting = false;
	};

	const signup = async () => {
		clearMessages();

		if ($visitor.password !== $visitor.confirmPassword) {
			errors.password = 'Passwords do not match';
		} else {
			requesting = true;
			const res = await fetch(`${URL}` + `signup`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					email: $visitor.email,
					password: $visitor.password,
					username: $visitor.username
				})
			});

			const data = await res.json();

			if (!res.ok) {
				errors.email = data.errors.email;
				errors.password = data.errors.password;
			} else {
				sendVerificationLink();
			}
		}
		requesting = false;
	};

	const sendVerificationLink = async () => {
		clearMessages();

		try {
			const res = await fetch(`${URL}` + `send_verification_link`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					email: $visitor.email
				})
			});

			const data = await res.json();

			if (!res.ok) {
				errors.email = data.error;
			} else {
				success = data.message;
			}
		} catch (err) {
			errors.email = err;
		}
	};

	const sendResetLink = async () => {
		clearMessages();
		sending = true;

		try {
			const res = await fetch(`${URL}` + `send_reset_link`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					email: $visitor.email
				})
			});

			const data = await res.json();

			if (!res.ok) {
				errors.email = data.error;
			} else {
				success = data.message;
			}
			sending = false;
		} catch (err) {
			errors.email = err;
		}
	};
</script>

<div class="w-full py-6 flex justify-center text-white">
    
    <div
		class="w-5/6 px-8 md:w-4/6 lg:w-1/2 max-w-96 py-12 text-center space-y-12"
	>
		{#if $user.username === undefined}
			<!-- {#if $user === undefined} -->
			<div class="flex flex-row items-center  cursor-pointer text-org-800" >
				<h2 class="cursor-pointer h-full flex p-2 py-6 justify-center items-center w-1/2  text-2xl hover:bg-org-600 hover:text-white" class:text-white={formType === 'login'} on:click={formLogin}>
					Log in
				</h2>
				<h2 class="cursor-pointer h-full flex p-2 py-6 justify-center items-center w-1/2  text-2xl hover:bg-org-600 hover:text-white" class:text-white={formType === 'signup'} on:click={formSignup}>
					Sign up
				</h2>
			</div>

			{#if success !== ''}
				<div
					transition:slide
					class="bg-grn-200 border-l-4 my-4 p-2 rounded-sm border-grn-600 text-grn-800"
				>
					{success}
				</div>
			{/if}

			<form class="space-y-8 md:space-y-10">
				{#if formType === 'signup'}
					<div transition:slide>
						<label for="username">
							<p class="sr-only">Username</p>
							<input
								bind:value={$visitor.username}
								on:keypress={clearMessages}
								id="username"
								type="text"
								autocomplete="username"
								placeholder="username"
								required
								class="w-full px-4 py-2 border-1 text-center placeholder-white placeholder-opacity-60 rounded-md bg-org-600 focus:outline-none"
							/>
							{#if errors.username !== ''}
								<div
									transition:slide
									class="bg-red-200 border-l-4 my-4 p-2 rounded-sm border-red-600 text-red-900"
								>
									{errors.username}
								</div>
							{/if}
						</label>
					</div>
				{/if}
				<div>
					<label for="email">
						<p class="sr-only">email</p>
						<input
							bind:value={$visitor.email}
							on:keypress={clearMessages}
							id="email"
							type="text"
							autocomplete="email"
                            placeholder="email"
                            required
							class="w-full px-4 py-2 border-1 text-center placeholder-white placeholder-opacity-60 rounded-md bg-org-600 focus:outline-none"
						/>
						{#if errors.email !== ''}
							<div
								transition:slide
								class="bg-red-200 border-l-4 my-4 p-2 rounded-sm border-red-600 text-red-800"
							>
								{errors.email}
							</div>
						{/if}
					</label>
				</div>
				<div>
					<label for="password">
						<p class="sr-only">password</p>
						<div class="relative">
							{#if $visitor.password !== ''}
								<div
									class="absolute flex justify-center  opacity-30 hover:opacity-100 inset-y-0 right-0 px-2"
									on:mouseenter={showPassword}
									on:mouseleave={hidePassword}
									transition:slide={{ delay: 300 }}
								>
									<Icon icon="view" />
								</div>
							{/if}

							<input
								bind:value={$visitor.password}
								on:keypress={clearMessages}
								id="password"
								type="password"
								autocomplete="password"
								placeholder="password"
								required
								class="w-full px-4 py-2 border-1 text-center placeholder-white placeholder-opacity-60 rounded-md bg-org-600 focus:outline-none"
							/>
						</div>
					</label>
				</div>

				{#if errors.password !== ''}
					<div
						transition:slide
						class="bg-red-200 border-l-4 my-4 p-2 rounded-sm border-red-600 text-red-800"
					>
						{errors.password}
					</div>
				{/if}

				{#if formType === 'signup'}
					<div transition:slide>
						<label for="confirmPassword">
							<p class="sr-only">confirm password</p>
							<div class="relative">
								{#if $visitor.confirmPassword !== ''}
									<div
										class="absolute flex justify-center  opacity-30 hover:opacity-100 inset-y-0 right-0 px-2"
										on:mouseenter={showConfirmPassword}
										on:mouseleave={hideConfirmPassword}
										transition:slide={{ delay: 300 }}
									>
										<Icon icon="view" />
									</div>
								{/if}

								<input
									bind:value={$visitor.confirmPassword}
									on:keypress={clearMessages}
									id="confirmPassword"
									type="password"
    								placeholder="confirm password"
									required
									class="w-full px-4 py-2 border-1 text-center placeholder-white placeholder-opacity-60 rounded-md bg-org-600 focus:outline-none"
								/>
							</div>
						</label>
					</div>
				{/if}

				{#if formType === 'login' && $visitor.email && $visitor.password && showResetPassword === false}
					{#if requesting}
						<div class="py-6" transition:fade>
							<Spinner />
						</div>
					{:else}
						<div transition:slide class="pt-6">
							<div on:click|preventDefault={login} >
								<Button icon="user">Log in</Button>
							</div>
						</div>
					{/if}
				{/if}
				{#if formType === 'signup' && $visitor.email && $visitor.password && $visitor.confirmPassword && $visitor.username && errors.username === ''}
					<div transition:slide={{ delay: 500 }} class="pt-6 space-y-6">
						{#if requesting}
							<div class="py-6" transition:fade>
								<Spinner />
							</div>
						{:else}
							<div on:click|preventDefault={signup}>
								<Button icon="check">Create account</Button>
							</div>
						{/if}
						<p class="">
							You will receive an email with a verification code to validate your email address
						</p>
					</div>
				{/if}
			</form>

			<div class="space-y-6">
				{#if formType === 'login'}
					<h2 class="cursor-pointer" on:click={toggleReset}>
						Forgot password ?
					</h2>

					{#if showResetPassword}
						<div transition:slide class="space-y-6">
							<p class="">Request an email with a link to reset your password</p>

							<div>
								<label for="email">
									<p class="sr-only">email</p>
									<input
										bind:value={$visitor.email}
										on:keypress={clearMessages}
										id="email"
										type="text"
										autocomplete="email"
										required
										class="w-full px-4 py-2 border-1 text-center placeholder-white placeholder-opacity-60 rounded-md bg-org-600 focus:outline-none"
									/>
								</label>
							</div>
							{#if sending}
								<div class="py-6" transition:fade>
									<Spinner />
								</div>
							{:else}
								<Button icon="mail" on:click={sendResetLink}>Send reset link</Button>
							{/if}
						</div>
					{/if}
					<h2
						class="cursor-pointer"
						on:click={() => {
							goto('/verify');
						}}
					>
						Email not verified ?
					</h2>
				{/if}
			</div>
		{:else}
			<h2 class="pt-24 text-2xl">
				Hello
				{$user.username}
				!
			</h2>
            <Button on:click={logout} icon="close">
                Log out
            </Button>
		{/if}
	</div>
</div>
