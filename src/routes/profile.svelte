<script>
	import Button from '$lib/components/UI/Button.svelte';
	import Icon from '$lib/components/UI/Icon.svelte';
	import ReviewAccordion from '$lib/components/UI/ReviewAccordion.svelte';
	import { user, isLoggedIn } from '$lib/stores/user';
	import { fetchedReviews } from '$lib/stores/nakamals';
	import auth0 from '$lib/services/auth0';
	import { auth0client } from '$lib/stores/auth0';
	import { goto } from '$app/navigation';

	const logout = () => {
		user.set({});
		auth0.logout($auth0client);
		goto('/');
	};

	$: userReviews = $fetchedReviews.filter((review) => {
		return review.user_id === $user._id;
	});
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

{#if $isLoggedIn}
	<div class="w-full my-4 flex justify-center overflow-y-auto">
		<div class="w-5/6 px-8 md:w-4/6 lg:w-1/2 max-w-96 py-12 text-center space-y-4">
			<div class="rounded-md bg-gradient-to-tr from-gry-200 to-gry-50 grid grid-cols-12 p-2">
				<div class="my-2 h-5 col-span-2 text-gry-400">
					<Icon icon="user2" />
				</div>
				<div class="col-span-10">
					<h4 class="text-grn-600 font-semibold text-left">
						{$user.username}
					</h4>

					<ReviewAccordion reviews={userReviews} showAccordion={true} />
				</div>
			</div>
			<div class="">
				<Button on:click={logout} height={'12'}>Log out</Button>
			</div>
		</div>
	</div>
{/if}
