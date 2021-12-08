<script>
	import Options from '$lib/components/UI/Options.svelte';
	import Rating from '$lib/components/UI/Rating.svelte';
	import Icon from '$lib/components/UI/Icon.svelte';
	// import { slide, fade } from 'svelte/transition';
	import { selectedID } from '$lib/stores/nakamals';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let nakamal = {};

	$: ({ _id, title, gps_lat, gps_lng, description, img_wp_url, tv, pool, kakai, alcohol, reviews } =
		nakamal);

	const locateNak = () => {
		selectedID.set(_id);

		dispatch('locateNak');
	};

	const viewNak = () => {
		selectedID.set(_id);
		dispatch('viewNak');
	};
</script>

<div
	class="flex h-full w-full rounded-br-3xl rounded-tl-3xl bg-gradient-to-br from-gry-200 to-gry-50"
>
	<div
		on:click={viewNak}
		class="bg-gradient-to-t from-gry-300 to-white w-1/3 rounded-tl-3xl overflow-hidden text-gry-600"
	>
		{#if img_wp_url}
			<img src={img_wp_url} alt={title} class="h-36 w-full object-cover" />
		{:else}
			<img src="/favicon.png" alt={title} class="h-full w-full object-contain p-4" />
		{/if}
	</div>

	<div class="w-2/3">
		<h3
			class="py-0.5 px-3 text-white text-sm font-medium uppercase bg-gradient-to-t from-grn-600 to-grn-500 flex justify-between items-center"
		>
			{title}
		</h3>

		<div class="px-2 sm:px-3 py-1 space-y-1 flex h-5/6 rounded-br-3xl">
			<div on:click={viewNak} class="w-3/4 flex flex-col justify-around">
				<div class="h-5">
					<Options {tv} {pool} {kakai} {alcohol} />
				</div>
				<Rating {reviews} />
			</div>
			<div class="w-1/4 pl-4">
				<button
					class="h-1/2 py-2 w-full text-gry-400 hover:bg-grn-500 hover:text-white  rounded-lg"
					on:click={viewNak}
				>
					<div class="h-4">
						<Icon icon="view" />
					</div>
					<p class="text-xs">View</p>
				</button>
				<button
					class="h-1/2 py-2 w-full text-gry-400 hover:bg-grn-500 hover:text-white  rounded-lg"
					on:click={locateNak}
				>
					<div class="h-4">
						<Icon icon="pin" />
					</div>
					<p class="text-xs">Map</p>
				</button>
			</div>
		</div>
	</div>
</div>
