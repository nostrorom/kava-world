<script>
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/UI/Button.svelte';
	import Icon from '$lib/components/UI/Icon.svelte';
	import { scale, fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	function toggle() {
		dispatch('toggle');
	}
</script>

<div
	transition:fade={{ duration: 200 }}
	class="fixed top-0 h-screen w-screen bg-gry-800 bg-opacity-70 z-30"
	on:click={toggle}
/>
<div
	transition:scale={{ duration: 200 }}
	class="fixed inset-t-10 inset-x-5 md:w-3/4 lg:w-1/2 wl:w-1/3 md:mx-auto bg-gradient-to-tr from-gry-300 to-white z-30 rounded-br-3xl rounded-tl-3xl"
>
	<div
		class="absolute top-0 right-0 z-40 w-1/4 h-12 md:w-1/6 rounded-bl-xl overflow-hidden bg-org-500"
	>
		<Button on:click={toggle}>
			<div class="h-5">
				<Icon icon="close" />
			</div>
			<div>Close</div>
		</Button>
	</div>
	<slot />
</div>
