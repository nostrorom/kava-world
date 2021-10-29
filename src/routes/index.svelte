<script context="module">
	export const prerender = true;

	export const load = async ({ fetch }) => {
		const nakRes = await fetch('/api/nakamals');
		const revRes = await fetch('/api/reviews');
		const nakamals = await nakRes.json();
		const reviews = await revRes.json();

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

<script>
	import { slide } from 'svelte/transition';
	import {
		fetchedNakamals,
		fetchedReviews,
		selectedNakamal,
		filteredNakamals
	} from '../stores/nakamals';
	import Button from '$lib/UI/Button.svelte';
	import Modal from '$lib/UI/Modal.svelte';
	import Nakamal from '$lib/Nakamal.svelte';
	import Filters from '$lib/Filters.svelte';

	import GoogleMap from '$lib/GoogleMap.svelte';

	export let data;

	fetchedNakamals.set(data.nakamals.nakamals);
	fetchedReviews.set(data.reviews.reviews);

	let showNumber = 24;
	$: displayedNakamals = $filteredNakamals.slice(0, showNumber);

	let showDetails = false;
	let showFilters = false;

	const toggleDetails = () => {
		showDetails = !showDetails;
	};

	const toggleFilters = () => {
		showFilters = !showFilters;
	};
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

{#if showDetails}
	<Modal on:toggle={toggleDetails}>
		<Nakamal nakamal={$selectedNakamal} />
	</Modal>
{/if}

{#if showFilters}
	<Modal on:toggle={toggleFilters}>
		<div class="bg-org-600">
			<Filters />
		</div>
	</Modal>
{/if}

<div class="flex w-full">
	<section class="w-full md:w-4/5">
		<div class="h-1/3 pb-1 relative">
			<GoogleMap
				mapDiv={'nakMap'}
				on:toggleDetails={toggleDetails}
				on:toggleFilters={toggleFilters}
			/>
		</div>
		<div class="h-2/3 space-y-2 overflow-y-auto relative">
			<div class="grid grid-cols-1lg:grid-cols-2 xl:grid-cols-3 gap-1 md:gap-2">
				{#each displayedNakamals as nakamal (nakamal._id)}
					<div class="">
						<Nakamal {nakamal} on:locateNak on:viewNak={toggleDetails} />
					</div>
				{/each}
			</div>
			<div class="h-24">
				{#if $filteredNakamals.length >= showNumber}
					<p class="text-white text-center">
						Showing {displayedNakamals.length} of {$filteredNakamals.length} results
					</p>
					<Button
						on:click={() => {
							showNumber += 24;
						}}
					>
						Show more
					</Button>
				{/if}
			</div>
		</div>
	</section>

	<aside class="w-1/5 hidden md:block">
		<div class="h-2/3 overflow-y-auto">
			<Filters />
		</div>
	</aside>
</div>
