<script>
    import { slide } from 'svelte/transition';

    export let title = 'More';

    export let showAccordion = false;

</script>

<div class="border-t border-b border-white border-opacity-40">
    <div on:click={() => {showAccordion = !showAccordion}} class="flex py-2 px-3 cursor-pointer justify-between items-center hover:bg-org-600 text-white">
        <span class="uppercase">
            {title}
        </span>
        <span class="">
            <svg class="transform h-6 text-white opacity-70 rotate-90" class:-rotate-90={showAccordion} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </span>
    </div>
    {#if showAccordion}
    <div transition:slide class="pt-1 pb-2 px-3 bg-orange-500">
        <slot />
    </div>
    {/if}
</div>
