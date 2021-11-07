<script>
	import Icon from '$lib/components/UI/Icon.svelte';
	import Spinner from '$lib/components/UI/Spinner.svelte';

	// export let icon;
	// export let iconSize = '5';
	export let size = 'text-base';
</script>

<button
	on:click
	class="{size} h-12 w-full flex py-1 px-3 text-white bg-black bg-opacity-20 hover:bg-grn-600 items-center justify-center space-x-2"
>
	<!-- <Spinner /> -->
	<!-- {#if icon}
		<div class="h-full py-2">
			<Icon {icon} />
		</div>
	{/if} -->
	<!-- <p class=""> -->
	<slot />
	<!-- </p> -->
</button>
