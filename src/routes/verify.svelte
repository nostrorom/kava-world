<script>
	import { onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';
	import Button from '$lib/components/UI/Button.svelte';
	import Icon from '$lib/components/UI/Icon.svelte';
	import Spinner from '$lib/components/UI/Spinner.svelte';
	import { goto } from '$app/navigation';

	import { visitor } from '$lib/stores/user.js';

	const URL = process.env.API_URL;

	let error = '';
	let success = '';
	let sendAgain = false;

	const clearMessages = () => {
		error = '';
		success = '';
	};

	let checking = false;
	let sending = false;
	let verified = false;

	$: if (success === 'Verified') {
		verified = true;
	}

	$: if (verified === true) {
		setTimeout(() => {
			goto('/login');
		}, 2000);
	}

	const toggleSendAgain = () => {
		sendAgain = !sendAgain;
	};

	onMount(() => {
		let search = document.location.search;
		let params = search.substring(search.indexOf('?'));
		$visitor.email = params.substring(1, params.indexOf('+'));
		$visitor.verificationCode = params.substring(params.indexOf('+') + 1);

		if ($visitor.email !== '' && $visitor.verificationCode !== '') {
			verifyEmail();
		}
	});

	const sendVerificationLink = async () => {
		clearMessages();

		try {
			const res = await fetch(`${URL}/send_verification_link`, {
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
				error = data.error;
			} else {
				success = data.message;
			}
			return;
		} catch (err) {
			error = err;
		}
	};

	const verifyEmail = async () => {
		clearMessages();
		checking = true;

		try {
			const res = await fetch(`${URL}/verify_email`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					email: $visitor.email,
					verificationCode: $visitor.verificationCode
				})
			});

			const data = await res.json();

			if (data.message === 'Verified') {
				verified = true;
			} else {
				error = data.error;
				// 'The code provided does not seem to match. Make sure your email and code are correct and retry. Othewise, please contact us for assistance';
			}
		} catch (err) {
			error =
				'There seems to be an issue confirming your email. Make sure your email and code are correct then please retry. If it still does not work, please contact us for assistance';
		}

		checking = false;
	};
</script>

<svelte:head>
	<title>Verify email</title>
</svelte:head>

<div class="w-full py-6 flex justify-center text-white">
	<div class="w-5/6 px-8 md:w-4/6 lg:w-1/2 max-w-96 py-12 text-center">
		{#if !verified}
			<div class="items-center cursor-pointer">
				<h2
					class="cursor-pointer h-full w-full flex p-2 pb-10 justify-center items-center text-2xl"
				>
					Verify your email address
				</h2>

				<form class="space-y-4 md:space-y-8">
					{#if error !== ''}
						<div
							transition:slide
							class="bg-red-200 border-l-4 my-4 p-2 rounded-sm text-red-900 border-red-600"
						>
							{error}
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
						</label>
					</div>
					<div>
						<label for="verificationCode">
							<p class="sr-only">Verification code</p>
							<input
								bind:value={$visitor.verificationCode}
								on:keypress={clearMessages}
								id="verificationCode"
								type="text"
								placeholder="verification code"
								required
								class="w-full px-4 py-2 border-1 text-center placeholder-white placeholder-opacity-60 rounded-md bg-org-600 focus:outline-none"
							/>
						</label>
					</div>

					{#if checking}
						<div class="py-6" transition:fade>
							<Spinner />
						</div>
					{:else if sendAgain === false}
						<div transition:slide class="pt-6">
							<div on:click|preventDefault={verifyEmail}>
								<Button icon="check">Verify your email</Button>
							</div>
						</div>
					{/if}
				</form>

				<div class="pt-6 space-y-6">
					<h2 class="text-mm-600 hover:text-mm-800 cursor-pointer" on:click={toggleSendAgain}>
						Did not get the code ?
					</h2>

					{#if sendAgain}
						<div transition:slide class="space-y-6">
							{#if success !== ''}
								<div
									transition:slide
									class="bg-grn-200 border-l-4 my-4 p-2 rounded-sm border-grn-600 text-grn-800"
								>
									{success}
								</div>
							{/if}

							<div class="space-y-8">
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
								</label>
							</div>

							{#if sending}
								<div class="py-6" transition:fade>
									<Spinner />
								</div>
							{:else}
								<div on:click|preventDefault={sendVerificationLink}>
									<Button icon="mail">Send me the code again</Button>
								</div>
							{/if}

							<p class="opacity-60">Don't forget to check in your spam folder as well</p>
						</div>
					{/if}
				</div>
			</div>
		{:else if verified}
			<div class="flex flex-col h-full justify-center items-center" transition:slide>
				<div class="text-white rounded-full bg-grn-600 p-12">
					<Icon icon="check" size="h-24" />
				</div>
				<h2 class="pt-12 pb-6 text-mm-600 font-bold text-2xl uppercase">verified</h2>
				<p class="text-mm-800">
					{$visitor.email}
				</p>
			</div>
		{/if}
	</div>
</div>
