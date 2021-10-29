<script>
	import Header from '$lib/Header.svelte';
	import Sidebar from '$lib/Sidebar.svelte';
	import '../app.postcss';
	import '@fontsource/poor-story';
	import '@fontsource/mulish';
</script>

<main class="h-screen bg-gradient-to-tr from-org-600 to-org-400 flex flex-col font-main">
	<div class="h-12">
		<Header />
	</div>
	<div class="flex appcontent">
		<Sidebar />
		<slot />
	</div>
</main>

<style>
	.appcontent {
		height: calc(100vh - 3rem);
	}
	:root {
		--scrollbarWidth: 5px;
		--scrollbarBg: #f45a00;
		--scrollbarThumb: #ff7700;
	}
	main {
		scrollbar-width: var(--scrollbarWidth);
		scrollbar-color: var(--scrollbarThumb) var(--scrollbarBg);
	}
	main::-webkit-scrollbar {
		width: var(--scrollbarWidth);
	}
	main::-webkit-scrollbar-track:no-button {
		background: var(--scrollbarBg);
	}
	main::-webkit-scrollbar-thumb {
		background-color: var(--scrollbarThumb);
		border-radius: 20px;
		border: 3px solid var(--scrollbarBg);
	}
	main::-webkit-scrollbar-button {
		display: none;
	}
</style>
