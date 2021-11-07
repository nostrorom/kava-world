<script context="module">
	export const prerender = true;

	export const load = async ({ fetch }) => {
		const res = await fetch('/api/blog');
		const data = await res.json();
		return {
			props: {
				data
			}
		};
	};
</script>

<script>
	import Blogpost from '$lib/components/Blogpost.svelte';
	export let data;
	let posts = data.fetchedPosts;
	// console.log(data)
	// console.log('BP', blogposts)
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<section class="h-full w-full space-y-2 overflow-y-scroll">
	{#each posts as post}
		<Blogpost {post} />
	{/each}
</section>
