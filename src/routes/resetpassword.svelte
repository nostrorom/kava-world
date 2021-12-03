<script>
	import { onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';
	import Button from '$lib/components/UI/Button.svelte';
	import Icon from '$lib/components/UI/Icon.svelte';
	import Spinner from '$lib/components/UI/Spinner.svelte';
	import { goto } from '$app/navigation';

	import { user, visitor } from '$lib/stores/user.js';

	const URL = 'https://nosdev-api.herokuapp.com/kavaworld/';

	let passwordInput;
	let confirmPasswordInput;

	let error = '';

	let requesting = false;
	let updated = false;

	// Utility functions

	const clearMessages = () => {
		error = '';
	};

	onMount(() => {
		let search = document.location.search;
		let params = search.substring(search.indexOf('?'));
		$visitor.email = params.substring(1, params.indexOf('+'));
		$visitor.resetCode = params.substring(params.indexOf('+') + 1);
	});

	if (typeof window !== 'undefined') {
		passwordInput = document.getElementById('password');
		confirmPasswordInput = document.getElementById('confirmPassword');
	}

	const showPassword = () => {
		passwordInput.type = 'text';
	};

	const hidePassword = () => {
		passwordInput.type = 'password';
	};

	const showConfirmPassword = () => {
		confirmPasswordInput.type = 'text';
	};

	const hideConfirmPassword = () => {
		confirmPasswordInput.type = 'password';
	};

	// Server requests

	const resetPassword = async () => {
		clearMessages();

		if ($visitor.password !== $visitor.confirmPassword) {
			error = 'Passwords do not match';
		} else {
			requesting = true;
			try {
				const res = await fetch(`${URL}` + `reset_password`, {
					method: 'POST',
					headers: {
						'Content-type': 'application/json'
					},
					body: JSON.stringify({
						email: $visitor.email,
						resetCode: $visitor.resetCode,
						password: $visitor.password
					})
				});

				const data = await res.json();

				if (!res.ok) {
					error = data.error;
				} else {
					user.set({
						_id: data._id,
						username: data.username,
						jwt: data.jwt
					});
					updated = true;
					setTimeout(() => {
						goto('/');
					}, 2000);
				}
			} catch (err) {
				error =
					'There seems to be an issue resetting your password. Please go to login and try again to get a reset link. If it still does not work, please contact us for assistance';
				console.log(err);
			}
		}
		requesting = false;
	};
</script>

<svelte:head>
	<title>Reset password</title>
</svelte:head>

<div class="w-full py-6 flex justify-center text-white">
	<div class="w-5/6 px-8 md:w-4/6 lg:w-1/2 max-w-96 py-12 text-center">
		{#if !updated}
			<div class="items-center cursor-pointer">
				<h2
					class="cursor-pointer h-full w-full flex p-2 pb-10 justify-center items-center text-2xl"
				>
					Reset your password
				</h2>

				<form class="space-y-4 md:space-y-8">
					{#if error !== ''}
						<div
							transition:slide
							class="bg-red-200 border-l-4 my-4 p-2 rounded-sm border-red-600 text-red-800"
						>
							{error}
						</div>
					{/if}

					<div>
						<label for="password">
							<p class="sr-only">password</p>
							<div class="relative">
								{#if $visitor.password !== ''}
									<div
										class="absolute flex justify-center text-mm-800 opacity-30 hover:opacity-100 inset-y-0 right-0 px-2"
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
									placeholder="new password"
									required
									class="w-full px-4 py-2 border-1 text-center placeholder-white placeholder-opacity-60 rounded-md bg-org-600 focus:outline-none"
								/>
							</div>
						</label>
					</div>

					<div>
						<label for="confirmPassword">
							<p class="sr-only">confirm password</p>
							<div class="relative">
								{#if $visitor.confirmPassword !== ''}
									<div
										class="absolute flex justify-center text-mm-800 opacity-30 hover:opacity-100 inset-y-0 right-0 px-2"
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
									placeholder="confirm new password"
									required
									class="w-full px-4 py-2 border-1 text-center placeholder-white placeholder-opacity-60 rounded-md bg-org-600 focus:outline-none"
								/>
							</div>
						</label>
					</div>

					{#if $visitor.password !== '' && $visitor.confirmPassword !== ''}
						{#if requesting}
							<div class="py-6" transition:fade>
								<Spinner />
							</div>
						{:else}
							<div transition:slide class="pt-6">
								<div on:click|preventDefault={resetPassword}>
									<Button icon="check">Reset your password</Button>
								</div>
							</div>
						{/if}
					{/if}
				</form>
			</div>
		{:else if updated}
			<div class="flex flex-col h-full justify-center items-center" transition:slide>
				<div class="text-white rounded-full bg-grn-600 p-12">
					<Icon icon="check" size="h-24" />
				</div>
				<h2 class="pt-12 pb-6 text-mm-600 font-bold text-2xl uppercase">Password reset</h2>
				<p class="text-mm-800">
					{$visitor.email}
				</p>
			</div>
		{/if}
	</div>
</div>
