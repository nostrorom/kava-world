<script context="module">
	export const prerender = false;

	export const load = async ({ fetch }) => {
		const userRes = await fetch('/api/users');
		const users = await userRes.json();
		const revRes = await fetch('/api/reviews');
		const reviews = await revRes.json();

		return {
			props: {
				data: {
					users,
					reviews
				}
			}
		};
	};
</script>

<script>
	import { onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';
	import Button from '$lib/components/UI/Button.svelte';
	import Icon from '$lib/components/UI/Icon.svelte';
	import ReviewAccordion from '$lib/components/UI/ReviewAccordion.svelte';
	import { user, visitor, usersWithHistory, userList, isLoggedIn } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { fetchedReviews } from '$lib/stores/nakamals';

	export let data;

	if ($userList.length === 0) {
		userList.set(data.users.users);
	}

	if ($fetchedReviews.length === 0) {
		fetchedReviews.set(data.reviews.reviews);
	}

	const convertDate = (timestamp) => {
		let date = new Date(timestamp);
		let day = date.getDay();
		let month = date.toLocaleString('default', { month: 'short' });
		let year = date.getFullYear();
		let text = `${day} ${month} ${year} `;
		return text;
	};
</script>

<div class="w-full my-4 flex justify-center overflow-y-auto">
	<div class="w-5/6 px-8 md:w-4/6 lg:w-1/2 max-w-96 py-12 text-center space-y-4">
		{#each $usersWithHistory as user}
			<div class="rounded-md bg-gradient-to-br from-gry-200 to-gry-50 grid grid-cols-12 p-2">
				<div class="my-2 h-5 col-span-2 text-gry-400">
					<Icon icon="user2" />
				</div>
				<div class="col-span-10">
					<h4 class="text-grn-600 font-semibold text-left">
						{user.username}
					</h4>
					<p class="text-sm text-gry-400 text-left">
						Joined {convertDate(user.createdAt)}
					</p>

					<ReviewAccordion reviews={user.reviews} />
				</div>
			</div>
		{/each}
	</div>
</div>
