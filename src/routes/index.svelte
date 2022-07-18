<script context="module" lang="ts">
	import type { LoadEvent } from '@sveltejs/kit';

	export const prerender: boolean = true;

	export const load = async ({ fetch }: LoadEvent) => {
		const nakRes: Response = await fetch('/api/nakamals');
		const revRes: Response = await fetch('/api/reviews');
		const nakamals: Nakamal[] = await nakRes.json();
		const reviews: Review[] = await revRes.json();

		return {
			props: {
				data: {
					nakamals,
					reviews
				}
			}
		};
	};
</script>

<script lang="ts">
	import {
		fetchedNakamals,
		fetchedReviews,
		selectedNakamal,
		inRangeNakamals,
		closestNak,
		mapCenter
	} from '$shared/nakamals';
	import Button from '$lib/components/UI/Button.svelte';
	import Modal from '$lib/components/UI/Modal.svelte';
	import NakamalCard from '$lib/components/Nakamal.svelte';
	import Feature from '$lib/components/Feature.svelte';
	import Filters from '$lib/components/Filters.svelte';

	import GoogleMap from '$lib/components/GoogleMap.svelte';

	export let data: {
		nakamals: {
			nakamals: Nakamal[];
		};
		reviews: {
			reviews: Review[];
		};
	};

	if ($fetchedReviews.length === 0) {
		fetchedReviews.set(data.reviews.reviews);
	}

	if ($fetchedNakamals.length === 0) {
		fetchedNakamals.set(data.nakamals.nakamals);
	}

	let showNumber: number = 24;
	$: displayedNakamals = $inRangeNakamals.slice(0, showNumber);

	let showDetails: boolean = false;
	let showFilters: boolean = false;

	const toggleDetails = (): void => {
		showDetails = !showDetails;
	};

	const toggleFilters = (): void => {
		showFilters = !showFilters;
	};

	const centerOnNak = (): void => {
		mapCenter.set({ lat: $selectedNakamal.gps_lat, lng: $selectedNakamal.gps_lng });
	};
</script>

<svelte:head>
	<title>Nakamals</title>
</svelte:head>

{#if showDetails}
	<Modal on:toggle={toggleDetails}>
		<Feature nakamal={$selectedNakamal} />
	</Modal>
{/if}

{#if showFilters}
	<Modal on:toggle={toggleFilters}>
		<div class="bg-org-600">
			<Filters />
		</div>
	</Modal>
{/if}

<div class="flex w-full h-full">
	<section class="w-full md:w-4/5">
		<div class="h-1/3 pb-1 relative">
			<!-- <GoogleMap
				mapDiv={'nakMap'}
				on:toggleDetails={toggleDetails}
				on:toggleFilters={toggleFilters}
			/> -->
		</div>
		<div class="h-2/3 space-y-2 overflow-y-auto relative">
			<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-1 md:gap-2">
				{#each displayedNakamals as nakamal (nakamal._id)}
					<div class="">
						<NakamalCard {nakamal} on:locateNak={centerOnNak} on:viewNak={toggleDetails} />
					</div>
				{/each}
			</div>
			<div class="h-24">
				{#if displayedNakamals.length === 0 && $closestNak.nakamal !== undefined}
					<p class="text-white text-center my-4">
						No nakamal matches your search. To get more results, try to modify your filters
					</p>
					<p class="text-white text-center my-4">
						The closest nakamal to your position is at
						<strong class=" text-lg font-bold">{$closestNak.distanceInKm} Km </strong>
						:
					</p>
					<div class="flex justify-center">
						<div class="max-w-96">
							<NakamalCard
								nakamal={$closestNak.nakamal}
								on:locateNak={centerOnNak}
								on:viewNak={toggleDetails}
							/>
						</div>
					</div>
				{:else}
					<p class="text-white text-center my-4">
						Showing {displayedNakamals.length} of {$inRangeNakamals.length} results
					</p>
				{/if}
				{#if $inRangeNakamals.length >= showNumber}
					<Button
						on:click={() => {
							showNumber += 24;
						}}
						height={'12'}
					>
						Show more
					</Button>
				{/if}
			</div>
		</div>
	</section>

	<aside class="w-1/5 hidden md:block">
		<div class="h-full overflow-y-auto">
			<Filters />
		</div>
	</aside>
</div>
