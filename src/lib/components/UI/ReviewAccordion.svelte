<script>
	import { user } from '$lib/stores/user';
	import Icon from '$lib/components/UI/Icon.svelte';
	import Review from '$lib/components/Review.svelte';
	import { slide } from 'svelte/transition';

	export let reviews = [];

	export let title;

	export let showAccordion = false;
</script>

<div class="">
	{#if reviews.length === 0 && title === undefined}
		<p class="text-sm text-gry-400 text-left">Has not posted any review</p>
	{:else}
		<div
			on:click={() => {
				showAccordion = !showAccordion;
			}}
			class="flex cursor-pointer justify-between items-center text-grn-600 group"
		>
			{#if title === undefined}
				<span class="text-sm">
					Has posted {reviews.length} reviews
				</span>
			{:else}
				<span class="text-sm">
					{title}
				</span>
			{/if}
			<span class="px-2 py-0.5 rounded-lg group-hover:bg-grn-500 group-hover:text-white">
				<svg
					class="transform h-4 rotate-90"
					class:-rotate-90={showAccordion}
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</span>
		</div>
		{#if showAccordion}
			<div transition:slide class="">
				{#each reviews as review}
					<!-- <div
						class="bg-gradient-to-tr from-gry-100 to-gry-50
                    rounded-md shadow-md py-1 px-1.5 my-2"
					>
						<div class="flex justify-between">
							<h5 class="text-sm text-orange-600">{review.nakamal_name}</h5>
							<div class="flex space-x-2">
								<div class="flex text-xs items-center space-x-0.5">
									<div class="h-3 text-grn-600">
										<Icon icon="leaf" />
									</div>
									<p class="text-gry-600">
										{review.kava_rating}
									</p>
								</div>
								<div class="flex text-xs items-center space-x-0.5">
									<div class="h-3 text-org-500">
										<Icon icon="lightbulb" />
									</div>
									<p class="text-gry-600">
										{review.nakamal_rating}
									</p>
								</div>
							</div>
						</div>
						{#if review.comment}
							<p class="text-sm text-left leading-tight text-gry-500 border-t border-gry-300">
								{review.comment}
							</p>
						{/if}
					</div> -->
					<Review {review} view="nakamal" />
				{/each}
			</div>
		{/if}
	{/if}
</div>
