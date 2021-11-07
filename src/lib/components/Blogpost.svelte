<script>
	import Icon from '$lib/components/UI/Icon.svelte';

	export let post = {
		_id: '',
		title: '',
		img_wp_url: '',
		content: ''
	};

	// export let _id = null;
	// export let title = null;
	// export let img = null;
	// export let text = null;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	const sendID = () => {
		let id = post._id;
		dispatch('highlight', { id });
		console.log(`from blog card: ${id}`);
	};
</script>

<div class="w-4/5 lg:w-1/2 mx-auto rounded-sm shadow-md bg-gray-100" on:click={sendID}>
	<h3
		class="font-logo py-1 px-1 text-center text-xl text-white uppercase font-medium bg-gradient-to-tr from-grn-500 via-grn-500 to-grn-400"
	>
		{post.title}
	</h3>

	<div class="overflow-hidden relative">
		{#if post.img_wp_url}
			<img src={post.img_wp_url} alt={post.title} class="w-full object-cover" />
		{/if}

		{#if post.content}
			<p class="p-4 text-gray-800 text-wrap space-y-2 overflow-ellipsis max-h-64">
				{@html post.content}
			</p>
		{/if}
	</div>
	<div class="flex justify-end items-center">
		<button
			class="rounded-tl-md mt-2 flex flew-row justify-center items-center space-x-3 uppercase text-md px-5 py-3 text-org-500 hover:bg-white"
		>
			<div class="flex items-center">
				<Icon icon="view" size="4" />
			</div>
			<p class="flex items-center ">Read more</p>
		</button>
	</div>
</div>
