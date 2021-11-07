<script>
	import Icon from '$lib/components/UI/Icon.svelte';

	export let reviews = {};

	// export let numRatings;
	// export let kavRating;
	// export let nakRating;
	// export let kavStars;
	// export let nakStars;

	$: ({ numRatings, kavRating, nakRating, kavStars, nakStars } = reviews);

	$: if (numRatings === undefined) {
		console.log('RTG', reviews);
	}
	// $: console.log(kavStars, nakStars);
</script>

<div class="space-y-1">
	<div class="flex text-sm">
		{#if numRatings === 0}
			<p class="text-gry-400 italic">No reviews yet</p>
		{:else if numRatings === 1}
			<p class="text-grn-800">1 review</p>
		{:else}
			<p class="text-grn-800">
				{numRatings} reviews
			</p>
		{/if}
	</div>
	<div class="flex items-center relative">
		<div class="absolute bottom-0 z-20 h-full w-full opacity-0 hover:opacity-100">
			<div
				class="text-white text-sm px-2 py-0.5 bg-org-600 rounded-lg shadow-lg absolute -top-6 hover:opacity-0 whitespace-nowrap"
			>
				Kava quality
			</div>
		</div>
		<div class="text-grn-600 h-4 w-4col-span-1">
			<Icon icon="leaf" />
		</div>
		<div class="flex items-center mx-3">
			{#each Array(kavStars) as _}
				<div class="text-xs">🥥</div>
			{/each}
			{#each Array(5 - kavStars) as _}
				<div class="text-xs opacity-10 grayscale">🥥</div>
			{/each}
		</div>
		<div class="w-8 flex justify-center">
			<p
				class="flex px-1.5 rounded-full font-bold justify-center text-sm bg-gry-200 text-gry-700 shadow-inner"
			>
				{kavRating}
			</p>
		</div>
	</div>

	<div class="flex items-center relative">
		<div class="absolute bottom-0 z-10 h-full w-full opacity-0 hover:opacity-100">
			<div
				class="text-white text-sm px-2 py-0.5 bg-org-600 rounded-lg shadow-lg absolute -top-6 hover:opacity-0 whitespace-nowrap"
			>
				Nakamal quality
			</div>
		</div>
		<div class="text-org-400 h-4 w-4 col-span-1 bg-red">
			<Icon icon="lightbulb" />
		</div>
		<div class="flex items-center mx-3">
			{#each Array(nakStars) as _}
				<div class="text-xs">🥥</div>
			{/each}
			{#each Array(5 - nakStars) as _}
				<div class="text-xs opacity-10 grayscale">🥥</div>
			{/each}
		</div>
		<div class="w-8 flex justify-center">
			<p
				class="flex px-1.5 rounded-full font-bold justify-center text-sm bg-gry-200 text-gry-700 shadow-inner"
			>
				{nakRating}
			</p>
		</div>
	</div>
</div>
