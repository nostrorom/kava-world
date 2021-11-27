<script>
	import Accordion from '$lib/components/UI/Accordion.svelte';
	import Icon from '$lib/components/UI/Icon.svelte';
	import { slide } from 'svelte/transition';
	import { fetchedNakamals, filterBy, inRangeNakamals } from '$lib/stores/nakamals';

	// Mapping items by rating

	let ratingRange = [5, 4, 3, 2, 1, 0];

	$: kavMapping = $inRangeNakamals
		.map((nakamal) => nakamal.reviews.kavStars)
		.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

	let kavOptions = {};

	$: ratingRange.forEach((i) => {
		kavOptions[i] = kavMapping.get(i) !== undefined ? kavMapping.get(i) : 0;
	});

	$: nakMapping = $inRangeNakamals
		.map((nakamal) => nakamal.reviews.nakStars)
		.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

	let nakOptions = {};

	$: ratingRange.forEach((i) => {
		nakOptions[i] = nakMapping.get(i) !== undefined ? nakMapping.get(i) : 0;
	});

	// Mapping items by country

	$: countryMapping = $inRangeNakamals
		.map((nakamal) => nakamal.country)
		.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

	$: countryOptions = [...countryMapping.entries()];

	// Mapping items by city

	$: cityMapping = $inRangeNakamals
		.map((nakamal) => nakamal.city)
		.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

	$: cityOptions = [...cityMapping.entries()];

	// Mapping items by features

	$: kakaiMapping = $inRangeNakamals
		.map((nakamal) => nakamal.kakai)
		.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
		.get(true);

	$: kakaiTrue = kakaiMapping === undefined ? 0 : kakaiMapping;

	$: alcoholMapping = $inRangeNakamals
		.map((nakamal) => nakamal.alcohol)
		.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
		.get(true);

	$: alcoholTrue = alcoholMapping === undefined ? 0 : alcoholMapping;

	$: tvMapping = $inRangeNakamals
		.map((nakamal) => nakamal.tv)
		.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
		.get(true);

	$: tvTrue = tvMapping === undefined ? 0 : tvMapping;

	$: poolMapping = $inRangeNakamals
		.map((nakamal) => nakamal.pool)
		.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
		.get(true);

	$: poolTrue = poolMapping === undefined ? 0 : poolMapping;

	const sortbykav = () => {
		let sorted = $inRangeNakamals.sort((nakA, nakB) => {
			// console.log(nakB.reviews.kavRating - nakA.reviews.kavRating);
			return nakB.reviews.kavRating - nakA.reviews.kavRating;
		});
		// console.log(sorted);
	};
	const sortbynak = () => {
		let sorted = $inRangeNakamals.sort((nakA, nakB) => {
			return nakB.reviews.nakRating - nakA.reviews.nakRating;
		});
		// console.log(sorted);
	};
</script>

<div class="">
	<Accordion title="Sort by" showAccordion={true}>
		<div>
			<label class="text-white">
				<input type="radio" value={'kav'} bind:group={$filterBy.sortBy.rating} />
				<span class="inline-block h-3 w-3">
					<Icon icon="leaf" color="text-white" size="3" />
				</span>
				<span class="inline-block text-sm">Kava rating</span>
			</label>
		</div>
		<div>
			<label class="text-white">
				<input type="radio" value={'nak'} bind:group={$filterBy.sortBy.rating} />
				<span class="inline-block h-3 w-3">
					<Icon icon="lightbulb" color="text-white" size="3" />
				</span>
				<span class="inline-block text-sm">Nak rating</span>
			</label>
		</div>
	</Accordion>
	<Accordion title="Kava" showAccordion={true}>
		<div>
			<label class="text-white">
				<input type="radio" value={false} bind:group={$filterBy.kavStars} />
				<span class="space-y-0.5">
					<span class="text-sm h-2">All</span>
				</span>
			</label>
		</div>
		{#each ratingRange as num}
			<div>
				<label class="text-white">
					<input type="radio" value={num} bind:group={$filterBy.kavStars} />
					<span class="space-y-0.5">
						{#each Array(num) as _}
							<span class="text-xs h-2">🥥</span>
						{/each}
					</span>
					<span class="rounded-full bg-orange-600 px-1.5 py-0.5 ml-1 text-xs">
						{kavOptions[num]}
					</span>
				</label>
			</div>
		{/each}
	</Accordion>
	<Accordion title="Nakamal" showAccordion={true}>
		<div>
			<label class="text-white">
				<input type="radio" value={false} bind:group={$filterBy.nakStars} />
				<span class="space-y-0.5">
					<span class="text-sm h-2">All</span>
				</span>
			</label>
		</div>
		{#each ratingRange as num}
			<div>
				<label class="text-white">
					<input type="radio" value={num} bind:group={$filterBy.nakStars} />
					<span class="space-y-0.5">
						{#each Array(num) as _}
							<span class="text-xs h-2">🥥</span>
						{/each}
					</span>
					<span class="rounded-full bg-orange-600 px-1.5 py-0.5 ml-1 text-xs">
						{nakOptions[num]}
					</span>
				</label>
			</div>
		{/each}
	</Accordion>

	<Accordion title="Facilities" showAccordion={true}>
		<div>
			<label class="text-white">
				<input type="checkbox" bind:checked={$filterBy.kakaiTick} />
				<span class="inline-block h-3">
					<Icon icon="kakai" color="text-white" size="3" />
				</span>
				<span class="inline-block text-sm">Kakai</span>
				<span class="inline-block rounded-full bg-orange-600 px-1.5 py-0.5 ml-1 text-xs"
					>{kakaiTrue}</span
				>
			</label>
		</div>
		<div>
			<label class="text-white">
				<input type="checkbox" bind:checked={$filterBy.alcoholTick} />
				<span class="inline-block h-3">
					<Icon icon="alcohol" color="text-white" size="3" />
				</span>
				<span class="inline-block text-sm">Drinks</span>
				<span class="inline-block rounded-full bg-orange-600 px-1.5 py-0.5 ml-1 text-xs"
					>{alcoholTrue}</span
				>
			</label>
		</div>
		<div>
			<label class="text-white">
				<input type="checkbox" bind:checked={$filterBy.tvTick} />
				<span class="inline-block h-3">
					<Icon icon="tv" color="text-white" size="3" />
				</span>
				<span class="inline-block text-sm">TV</span>
				<span class="inline-block rounded-full bg-orange-600 px-1.5 py-0.5 ml-1 text-xs"
					>{tvTrue}</span
				>
			</label>
		</div>
		<div>
			<label class="text-white">
				<input type="checkbox" bind:checked={$filterBy.poolTick} />
				<span class="inline-block h-3">
					<Icon icon="pool" color="text-white" size="3" />
				</span>
				<span class="inline-block text-sm">Pool table</span>
				<span class="inline-block rounded-full bg-orange-600 px-1.5 py-0.5 ml-1 text-xs"
					>{poolTrue}</span
				>
			</label>
		</div>
	</Accordion>

	<Accordion title="Country">
		<div>
			<label class="italic text-white">
				<input
					type="radio"
					value="all"
					bind:group={$filterBy.country}
					on:change={() => {
						$filterBy.city = 'all';
					}}
				/>
				<span> All </span>
				<span class="rounded-full bg-orange-600 px-1.5 py-0.5 ml-1 text-xs">
					{$fetchedNakamals.length}
				</span>
			</label>
		</div>
		{#each countryOptions as item}
			<div>
				<label class="text-white">
					<input
						type="radio"
						value={item[0]}
						bind:group={$filterBy.country}
						on:change={() => {
							$filterBy.city = 'all';
						}}
					/>
					<span>{item[0]}</span>
					<span class="rounded-full bg-orange-600 px-1.5 py-0.5 ml-1 text-xs">
						{item[1]}
					</span>
				</label>
			</div>
		{/each}
	</Accordion>

	{#if $filterBy.country !== 'all'}
		<div transition:slide>
			<Accordion title="City">
				<div>
					<label class="italic text-white">
						<input type="radio" value="all" bind:group={$filterBy.city} />
						<span> All </span>
						<span class="rounded-full bg-orange-600 px-1.5 py-0.5 ml-1 text-xs">
							{$inRangeNakamals.length}
						</span>
					</label>
				</div>
				{#each cityOptions as item}
					<div>
						<label class="text-white">
							<input type="radio" value={item[0]} bind:group={$filterBy.city} />
							<span>{item[0]}</span>
							<span class="rounded-full bg-orange-600 px-1.5 py-0.5 ml-1 text-xs">
								{item[1]}
							</span>
						</label>
					</div>
				{/each}
			</Accordion>
		</div>
	{/if}
</div>
