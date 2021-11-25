<script>
	import Icon from '$lib/components/UI/Icon.svelte';

	export let post = {};

	$: ({ _id, title, img_wp_url } = post);

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	const sendID = () => {
		let id = post._id;
		dispatch('highlight', { id });
	};
</script>

<div
	on:click={sendID}
	class="h-48 rounded-tl-2xl rounded-br-2xl overflow-hidden bg-gradient-to-t from-gry-300 to-gry-50 relative "
>
	<h3
		class="text-white text-sm md:text-base font-medium uppercase bg-gradient-to-t from-grn-600 to-grn-500 px-1 md:px-3 py-0.5 md:py-1"
	>
		{title}
	</h3>
	<div class="flex h-40">
		<div class="w-1/4 h-full ">
			{#if img_wp_url}
				<img src={img_wp_url} alt={title} class="h-full w-full object-cover" />
			{:else}
				<img src="/favicon.png" alt={title} class="h-full w-full object-contain p-4" />
			{/if}
		</div>
		<div class="w-3/4">
			<div
				class="h-full text-gry-600 text-sm md:text-base leading-tight md:leading-snug px-1.5 md:px-4 py-1"
			>
				{@html post.content}
			</div>
		</div>
	</div>
	<div class="flex justify-end h-1/5 absolute bottom-0 left-0 w-full">
		<button
			class="flex h-full items-center px-4 space-x-2 bg-gry-200 text-org-400 hover:bg-grn-500 hover:text-white rounded-tl-2xl"
		>
			<div class="h-5">
				<Icon icon="view" />
			</div>
			<p class="text-sm">Read</p>
		</button>
	</div>
</div>
