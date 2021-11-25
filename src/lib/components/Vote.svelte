<script>
	import { onMount } from 'svelte';
	import Button from '$lib/components/UI/Button.svelte';
	import Icon from '$lib/components/UI/Icon.svelte';
	import Review from '$lib/components/Review.svelte';
	import ReviewAccordion from '$lib/components/UI/ReviewAccordion.svelte';
	import { slide, fade } from 'svelte/transition';
	import { user, token, isLoggedIn } from '$lib/stores/user.js';
	import { fetchedReviews } from '$lib/stores/nakamals.js';
	import { goto } from '$app/navigation';

	export let nakamal;
	export let userReview;
	export let userHasReviewed = false;

	let votingActive = false;
	let showUserReview = false;

	let review = {
		user_username: $user.username,
		user_id: $user._id,
		nakamal_id: nakamal._id,
		nakamal_name: nakamal.title,
		kava_rating: null,
		nakamal_rating: null,
		comment: null
	};

	$: if (userHasReviewed) {
		review = userReview;
	}

	const submitReview = async () => {
		const res = await fetch('https://nosdev-api.herokuapp.com/kavaworld/reviews', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${$token}`
			},
			body: JSON.stringify({
				...review
			})
		});

		const data = await res.json();

		if (res.ok) {
			fetchedReviews.set([review, ...$fetchedReviews]);
			votingActive = false;
		}
	};
</script>

<div class="flex justify-center items-center text-gry-700 mb-1">
	{#if !$isLoggedIn}
		<div class="flex justify-center items-center text-sm px-4 py-3 italic">
			<p>You need to</p>
			<button
				class="px-3 py-0.5 mx-1 bg-gry-300 hover:bg-grn-500 hover:text-white rounded-lg"
				on:click={() => {
					goto('/login');
				}}
			>
				<p class="">log in</p>
			</button>
			<p>to post a review</p>
		</div>
	{:else if !votingActive}
		{#if userHasReviewed}
			<div class="w-full">
				<div
					on:click={() => {
						showUserReview = !showUserReview;
					}}
					class="px-4 flex cursor-pointer justify-between items-center text-gry-400 group"
				>
					<span class="text-sm"> See my review </span>
					<span class="px-2 py-0.5 rounded-lg group-hover:bg-grn-500 group-hover:text-white">
						<svg
							class="transform h-4 rotate-90"
							class:-rotate-90={showUserReview}
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</span>
				</div>
				{#if showUserReview}
					<div transition:slide class="my-4 w-full">
						<button
							class="flex justify-between w-full group"
							on:click={() => {
								votingActive = true;
							}}
						>
							<!-- <p class="text-sm text-gry-400">See my review:</p> -->
							<div class="md: hidden group-hover:flex">
								<Button height="5" size="text-xs">
									<div class="h-4 text-gry-500 group-hover:text-white">
										<Icon icon="review" />
									</div>
									<!-- <p class="text-gry-500 group-hover:text-white">Edit</p> -->
								</Button>
							</div>
						</button>
						<Review review={userReview} view="author" />
					</div>
				{/if}
			</div>
		{:else}
			<div class="flex justify-center my-2 text-sm group bg-white">
				<Button
					on:click={() => {
						votingActive = true;
					}}
				>
					<div class="h-4 text-gry-500 group-hover:text-white">
						<Icon icon="review" />
					</div>
					<p class="text-gry-500 group-hover:text-white">Write a review</p>
				</Button>
			</div>
		{/if}
	{/if}
</div>

{#if votingActive}
	<div transition:slide class="flex flex-col items-center text-gry-600 border-l-4 border-grn-700">
		<div class="py-2 flex justify-center items-center">
			<div class="h-6 text-grn-600">
				<Icon icon="leaf" />
			</div>

			<div class="flex items-center space-x-6 px-7">
				{#each Array(5) as _, i}
					<div class="flex flex-col items-cetner">
						<label for="kavaRating">
							<p class="text-center text-sm font-bold">
								{i + 1}
							</p>
							<input
								class="block h-5 w-5"
								type="radio"
								bind:group={review.kava_rating}
								value={i + 1}
							/>
						</label>
					</div>
				{/each}
			</div>
		</div>

		<div class="py-2 flex justify-center items-center">
			<div class="h-6 text-org-600">
				<Icon icon="lightbulb" />
			</div>

			<div class="flex items-center space-x-6 px-7">
				{#each Array(5) as _, i}
					<div class="flex flex-col items-cetner">
						<label for="kavaRating">
							<p class="text-center text-sm font-bold">
								{i + 1}
							</p>
							<input
								class="block h-5 w-5"
								type="radio"
								bind:group={review.nakamal_rating}
								value={i + 1}
							/>
						</label>
					</div>
				{/each}
			</div>
		</div>
		<div class="my-2 space-y-2 w-5/6">
			<!-- <p class="text-sm ">Comment (optional):</p> -->
			<textarea
				class="shadow-md w-full px-2 py-1"
				rows="4"
				bind:value={review.comment}
				placeholder="Your comment"
			/>
		</div>
		<div class="flex space-x-2">
			<div class="bg-gry-100 rounded-lg shadow-sm">
				<Button
					on:click={() => {
						votingActive = false;
					}}
					hover="bg-org-600"
				>
					<div class="h-3 w-3">
						<Icon icon="close" />
					</div>
					<div class="">Cancel</div>
				</Button>
			</div>
			{#if review.kava_rating !== null && review.nakamal_rating !== null}
				<div class="bg-grn-500 h-10" transition:slide>
					<Button on:click={submitReview}>
						<div class="h-3 w-3">
							<Icon icon="check" />
						</div>
						<div class="">Post</div>
					</Button>
				</div>
			{/if}
		</div>
	</div>
{/if}
