<script>
	import Accordion from '$lib/components/UI/Accordion.svelte';
	import Icon from '$lib/components/UI/Icon.svelte';
	import { slide } from 'svelte/transition';
	import { fetchedNakamals, filterBy, filteredNakamals } from '$lib/stores/nakamals';

	// Filtering by country

	$: countryMapping = $filteredNakamals
		.map((nakamal) => nakamal.country)
		.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

	$: countryOptions = [...countryMapping.entries()];

	// Filtering by city

	$: cityMapping = $filteredNakamals
		.map((nakamal) => nakamal.city)
		.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

	$: cityOptions = [...cityMapping.entries()];

	// Filtering by features

	$: kakaiMapping = $filteredNakamals
		.map((nakamal) => nakamal.kakai)
		.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
		.get(true);

	$: kakaiTrue = kakaiMapping === undefined ? 0 : kakaiMapping;

	$: alcoholMapping = $filteredNakamals
		.map((nakamal) => nakamal.alcohol)
		.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
		.get(true);

	$: alcoholTrue = alcoholMapping === undefined ? 0 : alcoholMapping;

	$: tvMapping = $filteredNakamals
		.map((nakamal) => nakamal.tv)
		.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
		.get(true);

	$: tvTrue = tvMapping === undefined ? 0 : tvMapping;

	$: poolMapping = $filteredNakamals
		.map((nakamal) => nakamal.pool)
		.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
		.get(true);

	$: poolTrue = poolMapping === undefined ? 0 : poolMapping;
</script>

<div class="">
	<Accordion title="Country" showAccordion="true">
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
							{$filteredNakamals.length}
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

	<Accordion title="Facilities" showAccordion="true">
		<div>
			<label class="text-white">
				<input type="checkbox" bind:checked={$filterBy.kakaiTick} />
				<span class="inline-block h-4">
					<Icon icon="kakai" color="text-white" size="3" />
				</span>
				<span class="inline-block">Kakai</span>
				<span class="inline-block rounded-full bg-orange-600 px-1.5 py-0.5 ml-1 text-xs"
					>{kakaiTrue}</span
				>
			</label>
		</div>
		<div>
			<label class="text-white">
				<input type="checkbox" bind:checked={$filterBy.alcoholTick} />
				<span class="inline-block h-4">
					<Icon icon="alcohol" color="text-white" size="3" />
				</span>
				<span class="inline-block">Drinks</span>
				<span class="inline-block rounded-full bg-orange-600 px-1.5 py-0.5 ml-1 text-xs"
					>{alcoholTrue}</span
				>
			</label>
		</div>
		<div>
			<label class="text-white">
				<input type="checkbox" bind:checked={$filterBy.tvTick} />
				<span class="inline-block h-4">
					<Icon icon="tv" color="text-white" size="3" />
				</span>
				<span class="inline-block">TV</span>
				<span class="inline-block rounded-full bg-orange-600 px-1.5 py-0.5 ml-1 text-xs"
					>{tvTrue}</span
				>
			</label>
		</div>
		<div>
			<label class="text-white">
				<input type="checkbox" bind:checked={$filterBy.poolTick} />
				<span class="inline-block h-4">
					<Icon icon="pool" color="text-white" size="3" />
				</span>
				<span class="inline-block">Pool table</span>
				<span class="inline-block rounded-full bg-orange-600 px-1.5 py-0.5 ml-1 text-xs"
					>{poolTrue}</span
				>
			</label>
		</div>
	</Accordion>
</div>
