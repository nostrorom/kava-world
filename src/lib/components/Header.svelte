<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/UI/Button.svelte';
	import logo from '../../../static/logo-stacked.svg';
	import { user, isLoggedIn } from '$lib/stores/user';
	import { isAuthenticated } from '$lib/stores/auth0';
	import Icon from '$lib/components/UI/Icon.svelte';

	// $: console.log('auth', $isAuthenticated, 'log', $isLoggedIn, $user);
</script>

<header class="flex w-full h-full py-1 justify-between items-center">
	<div class="h-full pl-2 lg:pl-4">
		<a href="/">
			<img class="h-full" src={logo} alt="SvelteKit" />
		</a>
	</div>

	<div class="">
		{#if !$isLoggedIn || $user.username === undefined}
			<Button
				on:click={() => {
					goto('/login');
				}}
				height={'12'}
			>
				<div class="h-5">
					<Icon icon="user" />
				</div>
				<div class="whitespace-nowrap">Log in</div>
			</Button>
		{:else}
			<Button
				on:click={() => {
					goto('/profile');
				}}
				height={'12'}
			>
				<div class="h-5">
					<Icon icon="user" />
				</div>
				<div class="whitespace-nowrap">
					{$user.username}
				</div>
			</Button>
		{/if}
	</div>
</header>
