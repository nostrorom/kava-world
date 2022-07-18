<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '$lib/components/UI/Icon.svelte';
</script>

<div class="flex flex-col justify-between h-full w-16 md:w-1/5">
	<nav class="">
		<ul class="text-org-900">
			<li>
				<a href="/blog">
					<div
						class="uppercase text-xl font-logo font-bold py-8 grid grid-cols-1 md:grid-cols-3 hover:bg-org-700 hover:text-white"
						class:text-white={$page.url.pathname === '/blog'}
					>
						<div class="h-6 lg:h-7 flex items-center justify-center">
							<Icon icon="news" />
						</div>
						<p class="hidden md:flex text-base lg:text-lg md:col-span-2">Blog</p>
					</div>
				</a>
			</li>
			<li>
				<a href="/">
					<div
						class="uppercase text-xl font-logo font-bold py-8 grid grid-cols-1 md:grid-cols-3 hover:bg-org-700 hover:text-white"
						class:text-white={$page.url.pathname === '/'}
					>
						<div class="h-6 lg:h-7 flex items-center justify-center">
							<Icon icon="lightbulb" />
						</div>
						<p class="hidden md:flex text-base lg:text-lg md:col-span-2">Nakamals</p>
					</div>
				</a>
			</li>
			<!-- <li>
				<a href="/producers">
					<div
						class="uppercase text-xl font-logo font-bold py-8 grid grid-cols-1 md:grid-cols-3 hover:bg-org-700 hover:text-white"
						class:text-white={$page.url.pathname === '/producers'}
					>
						<div class="h-6 lg:h-7 flex items-center justify-center">
							<Icon icon="leaf" />
						</div>
						<p class="hidden md:flex text-base lg:text-lg md:col-span-2">Producers</p>
					</div>
				</a>
			</li> -->
			<li>
				<a href="/users">
					<div
						class="uppercase text-xl font-logo font-bold py-8 grid grid-cols-1 md:grid-cols-3 hover:bg-org-700 hover:text-white"
						class:text-white={$page.url.pathname === '/users'}
					>
						<div class="h-6 lg:h-7 flex items-center justify-center">
							<Icon icon="users" />
						</div>
						<p class="hidden md:flex text-base lg:text-lg md:col-span-2">Users</p>
					</div>
				</a>
			</li>
			<li>
				<a href="https://kava-store.com" target="_blank">
					<div
						class="uppercase text-xl font-logo font-bold py-8 grid grid-cols-1 md:grid-cols-3 hover:bg-org-700 hover:text-white"
						class:text-white={$page.url.pathname === '/shop'}
					>
						<div class="h-6 lg:h-7 flex items-center justify-center">
							<Icon icon="cart" />
						</div>
						<p class="hidden md:flex text-base lg:text-lg md:col-span-2">Shop</p>
					</div>
				</a>
			</li>
		</ul>
	</nav>

	<footer class="text-white">
		<div class="grid grid-cols-1 md:grid-cols-3">
			<a
				class="py-4 hover:bg-org-700"
				href="https://www.youtube.com/channel/UC1z0B9daQjM3wfjok0eevvA"
				target="_blank"
			>
				<div class="items-center justify-center md:flex text-base lg:text-lg h-6">
					<Icon icon="youtube" />
				</div>
			</a>
			<a class="py-4 hover:bg-org-700" href="https://www.facebook.com/KavaWorld" target="_blank">
				<div class="items-center justify-center md:flex text-base lg:text-lg h-6">
					<Icon icon="facebook" />
				</div>
			</a>
			<a class="py-4 hover:bg-org-700" href="https://www.instagram.com/kavaworld/" target="_blank">
				<div class="items-center justify-center md:flex text-base lg:text-lg h-6">
					<Icon icon="instagram" />
				</div>
			</a>
		</div>

		<div class="text-md font-sans text-center text-gray-200 w-full">
			<!-- <div class="py-4 px-1 w-full text-xs items-center justify-center hover:bg-org-700">
            <a href="terms" class="hover:text-white text-xs md:text-md">
                <p class="leading-none">Terms & Conditions</p>
            </a>
        </div> -->
			<div class="py-3 px-1 w-full text-xs items-center hover:bg-org-700">
				<a
					href="https://www.pacific-digital-transformation.com/"
					target="_blank"
					class="hover:text-white hidden md:flex justify-center"
				>
					Pacific Digital Transformation 2021
				</a>
				<a
					href="https://www.pacific-digital-transformation.com/"
					target="_blank"
					class="hover:text-white flex flex-col md:hidden"
				>
					<p class="leading-none">
						<em>PDT</em>
					</p>
					<p>2021</p>
				</a>
			</div>
		</div>
	</footer>
</div>
