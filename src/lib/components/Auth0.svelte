<script>
	import { onMount } from 'svelte';
	import auth0 from '$lib/services/auth0';
	import { isAuthenticated, auth0user } from '$lib/stores/auth0';

	let auth0Client;

	onMount(async () => {
		auth0Client = await auth0.createClient();
		isAuthenticated.set(await auth0Client.isAuthenticated());
		auth0user.set(await auth0Client.getUser());
	});

	function login() {
		auth0.loginWithPopup(auth0Client);
	}

	function logout() {
		auth0.logout(auth0Client);
	}
</script>

<div class="bg-org-600 h-full w-24 mx-auto">
	{#if $isAuthenticated}
		<h2>Hey {$auth0user.name}!</h2>
		{#if $auth0user.picture}
			<img src={$auth0user.picture} alt={auth0user.name} />
		{:else}
			<img src="https://source.unsplash.com/random/400x300" alt="Random" />
		{/if}
		<button on:click={logout}>Logout</button>
	{:else}
		<div ck />
		<button class="bg-grn-300" on:click={login}>Login</button>
	{/if}
</div>

<div />
