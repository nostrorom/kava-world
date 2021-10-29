<script>
	import Icon from '$lib/UI/Icon.svelte';

	export let tv;
	export let pool;
	export let kakai;
	export let alcohol;
</script>

<div class="text-gry-400 flex h-full">
	<div class="flex w-4 mr-2 relative" class:hidden={!kakai}>
		<Icon icon="kakai" />
		<div class="absolute bottom-0 h-full w-full opacity-0 hover:opacity-100">
			<div
				class="text-white text-sm px-2 py-0.5 bg-org-600 rounded-lg shadow-lg absolute -top-6 hover:opacity-0 whitespace-nowrap"
			>
				Kakai
			</div>
		</div>
	</div>
	<div class="flex w-4 mr-2 relative" class:hidden={!alcohol}>
		<Icon icon="alcohol" />
		<div class="absolute bottom-0 h-full w-full opacity-0 hover:opacity-100">
			<div
				class="text-white text-sm px-2 py-0.5 bg-org-600 rounded-lg shadow-lg absolute -top-6 hover:opacity-0 whitespace-nowrap"
			>
				Alcoholic drinks
			</div>
		</div>
	</div>
	<div class="flex w-4 mr-2 relative" class:hidden={!tv}>
		<Icon icon="tv" />
		<div class="absolute bottom-0 h-full w-full opacity-0 hover:opacity-100">
			<div
				class="text-white text-sm px-2 py-0.5 bg-org-600 rounded-lg shadow-lg absolute -top-6 hover:opacity-0 whitespace-nowrap"
			>
				TV
			</div>
		</div>
	</div>
	<div class="flex w-4 mr-2 relative" class:hidden={!pool}>
		<Icon icon="pool" />
		<div class="absolute bottom-0 h-full w-full opacity-0 hover:opacity-100">
			<div
				class="text-white text-sm px-2 py-0.5 bg-org-600 rounded-lg shadow-lg absolute -top-6 hover:opacity-0 whitespace-nowrap"
			>
				Pool table
			</div>
		</div>
	</div>
</div>
