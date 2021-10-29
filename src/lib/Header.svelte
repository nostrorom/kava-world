<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/UI/Button.svelte';
	import logo from '../../static//logo-stacked.svg';
	import { user } from '../stores/user';
	import Icon from './UI/Icon.svelte';
</script>

<header class="flex w-full h-full py-1 justify-between items-center">
	<div class="h-full pl-2 lg:pl-4">
		<a href="/">
			<img class="h-full" src={logo} alt="SvelteKit" />
		</a>
	</div>

	<div class="">
		<Button
			on:click={() => {
				goto('/login');
			}}
		>
			<div class="h-5">
				<Icon icon="user" />
			</div>
			<div class="whitespace-nowrap">
				{#if $user.username === undefined}
					Log in
				{:else}
					{$user.username}
				{/if}
			</div>
		</Button>
	</div>
</header>
