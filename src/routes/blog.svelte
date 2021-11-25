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
	import Modal from '$lib/components/UI/Modal.svelte';
	export let data;
	let posts = data.posts;
	let showModal = false;

	let postID = null;

	const toggleModal = () => {
		showModal = !showModal;
	};

	let readPost = (event) => {
		postID = event.detail.id;
		toggleModal();
	};

	$: selctedPost = posts.find((post) => {
		return post._id === postID;
	});
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

{#if showModal}
	<Modal on:toggle={toggleModal}>
		<div class="h-screen pb-24 bg-opacity-0">
			<div
				class="w-full h-full rounded-br-3xl rounded-tl-3xl bg-gradient-to-br from-gry-200 to-gry-50 overflow-y-auto"
			>
				<div class="bg-gradient-to-t from-gry-300 to-white h-1/4 rounded-tl-3xl text-gry-700">
					<h3
						class="py-0.5 px-3 text-white text-lg font-medium uppercase bg-gradient-to-t from-grn-700 to-grn-600 flex justify-between items-center leading-snug"
					>
						{selctedPost.title}
					</h3>
					{#if selctedPost.img_wp_url}
						<img
							src={selctedPost.img_wp_url}
							alt={selctedPost.title}
							class="h-36 w-full object-cover"
						/>
					{:else}
						<img
							src="/favicon.png"
							alt={selctedPost.title}
							class="h-full w-full object-contain p-4"
						/>
					{/if}
				</div>
				<div class="p-2 md:p-4 text-gry-600 leading-snug h-full">
					<p>
						{@html selctedPost.content}
					</p>
				</div>
			</div>
		</div>
	</Modal>
{/if}

<section class="h-full w-full md:w-3/4 space-y-2 md:space-y-3 overflow-y-auto">
	{#each posts as post}
		<Blogpost {post} on:highlight={readPost} />
	{/each}
</section>
