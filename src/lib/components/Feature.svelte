<script>
	import Options from '$lib/components/UI/Options.svelte';
	import Rating from '$lib/components/UI/Rating.svelte';
	import { slide, fade } from 'svelte/transition';
	import { selectedID, reviewedNakamals } from '../stores/nakamals';

	export let nakamal = {
		_id: '',
		title: '',
		description: '',
		img_wp_url: '',
		tv: '',
		pool: '',
		kakai: '',
		alcohol: '',
		reviews: ''
	};

	export let _id = nakamal._id;
	export let title = nakamal.title;
	export let description = nakamal.description;
	export let img_wp_url = nakamal.img_wp_url;
	export let tv = nakamal.tv;
	export let pool = nakamal.pool;
	export let kakai = nakamal.kakai;
	export let alcohol = nakamal.alcohol;
	export let reviews = nakamal.reviews;
</script>

<div
	on:click={() => {
		selectedID.set(_id);
	}}
	class="flex flex-col h-full w-full cursor-pointer rounded-br-3xl"
>
	<div class="bg-gradient-to-t from-gry-300 to-white h-48 rounded-tl-3xl overflow-hidden">
		{#if img_wp_url}
			<img src={img_wp_url} alt={title} class="h-full w-full object-cover" />
		{:else}
			<img src="/favicon.png" alt={title} class="h-full w-full object-contain p-4" />
		{/if}
	</div>

	<h3
		class="py-1 pl-3 pr-1 text-xl text-white font-medium uppercase bg-gradient-to-t from-grn-600 to-grn-500 flex justify-between items-center"
	>
		{title}
		<Options {tv} {pool} {kakai} {alcohol} />
	</h3>

	<div
		class="px-3 py-2 space-y-1 flex flex-col flex-grow rounded-br-3xl bg-gradient-to-tr from-gry-200 to-white"
	>
		{#if description}
			<p class="text-gray-700 leading-snug">{@html description}</p>
		{/if}
		<Rating {reviews} />
	</div>
</div>
