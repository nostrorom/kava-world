<script>
	import Icon from '$lib/components/UI/Icon.svelte';

	export let review;
	export let view = 'author';
</script>

<div
	class="bg-gradient-to-tr from-gry-100 to-gry-50
                    rounded-md shadow-md py-1 px-1.5 my-2"
>
	<div class="flex justify-between">
		{#if view === 'author'}
			<h5 class="text-sm text-grn-700 ">
				{review.user_username}
			</h5>
		{:else if view === 'nakamal'}
			<h5 class="text-sm text-orange-600">{review.nakamal_name}</h5>
		{/if}
		<div class="flex space-x-2">
			<div class="flex text-xs items-center space-x-0.5">
				<div class="h-3 text-grn-600">
					<Icon icon="leaf" />
				</div>
				<p class="text-gry-600">
					{review.kava_rating}
				</p>
			</div>
			<div class="flex text-xs items-center space-x-0.5">
				<div class="h-3 text-org-500">
					<Icon icon="lightbulb" />
				</div>
				<p class="text-gry-600">
					{review.nakamal_rating}
				</p>
			</div>
		</div>
	</div>
	{#if review.comment}
		<p class="text-sm text-left leading-tight text-gry-500 border-t border-gry-300">
			{review.comment}
		</p>
	{/if}
</div>
