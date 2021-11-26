<script>
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import Icon from '$lib/components/UI/Icon.svelte';
	import Button from '$lib/components/UI/Button.svelte';
	import Spinner from '$lib/components/UI/Spinner.svelte';
	// import { Loader } from '@googlemaps/js-api-loader';
	import * as pkg from '@googlemaps/js-api-loader';
	const { Loader } = pkg;

	console.log(Loader);

	const dispatch = createEventDispatcher();

	const toggleDetails = () => {
		dispatch('toggleDetails');
	};

	import {
		filteredNakamals,
		reviewedNakamals,
		markerIDinRange,
		selectedID,
		selectedNakamal,
		locateUser,
		filterBy
	} from '$lib/stores/nakamals';

	export let mapDiv;

	const loader = new Loader({
		apiKey: process.env.MAP_API_KEY,
		version: 'weekly',
		libraries: ['geometry']
	});

	let map;
	let isMapScriptLoaded = false;
	let isMapMounted = false;
	let areMarkersLoaded = false;
	let mapCoords = { nor: '', est: '', sth: '', wst: '' };
	let mapBounds;

	let markers = [];
	let pointer;
	let userMarker;

	let startPos;
	let yumiwork = { lat: -17.738600749041584, lng: 168.31435099901404 };
	let searchArea;
	let radiusInKm = 2;
	$: searchRadius = radiusInKm * 1000;

	// Load script and initiate map

	const initiateMap = () => {
		loader.loadCallback((err) => {
			if (err) {
				console.log(err.message);
			} else if (document.getElementById(`${mapDiv}`) === null) {
				setTimeout(() => {
					console.log('reloading');
					initiateMap();
				}, 1);
			} else {
				yumiwork = new google.maps.LatLng(yumiwork);
				startPos = yumiwork;

				map = new google.maps.Map(document.getElementById(`${mapDiv}`), {
					center: yumiwork,
					zoom: 13,
					streetViewControl: true
				});

				userMarker = new google.maps.Marker({
					position: startPos,
					map: map,
					options: { title: 'Me' },
					icon: {
						path: google.maps.SymbolPath.CIRCLE,
						scale: 6,
						strokeWeight: 2,
						strokeColor: '#4D7C0F',
						fillOpacity: 0.6,
						fillColor: '#A3E635',
						animation: google.maps.Animation.DROP
					}
				});

				searchArea = new google.maps.Circle({
					strokeColor: '#4D7C0F',
					strokeOpacity: 0.5,
					strokeWeight: 1,
					fillColor: '#CCC',
					fillOpacity: 0.15,
					center: startPos,
					radius: searchRadius
				});

				isMapScriptLoaded = true;
			}
		});
	};

	$: if (typeof window !== 'undefined') {
		initiateMap();
	}

	$: if (isMapScriptLoaded) {
		google.maps.event.addListener(map, 'bounds_changed', () => {
			mapBounds = map.getBounds();
		});

		if (mapBounds !== undefined) {
			isMapMounted = true;
		}
	}

	// Defining markers

	$: if (isMapMounted && $reviewedNakamals.length !== 0) {
		markers = $reviewedNakamals
			.filter((nakamal) => {
				return nakamal.gps_lat !== null && nakamal.gps_lng !== null;
			})
			.map((nakamal) => {
				let marker = new google.maps.Marker({
					position: {
						lat: nakamal.gps_lat,
						lng: nakamal.gps_lng
					},
					type: nakamal.type,
					map: null,
					options: { title: nakamal.title },
					_id: nakamal._id,
					icon: {
						path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
						scale: 4,
						strokeWeight: 0.5,
						strokeColor: '#FFF',
						fillOpacity: 0.9,
						fillColor: '#FF5F00'
					},
					animation: google.maps.Animation.DROP
				});

				marker.addListener('click', () => {
					selectedID.set(marker._id);
				});

				return marker;
			});
	}

	// Displaying markers, reacting to filter and range change

	$: if (isMapMounted) {
		if ($locateUser == true) {
			searchArea.setMap(map);
			searchArea.setCenter(map.getCenter());
			searchArea.setRadius(searchRadius);
		} else {
			searchArea.setMap(null);
		}
		filterBy.set({ ...$filterBy });
		displayMarkers();
	}

	const displayMarkers = () => {
		let inRange = [];

		let center = map.getCenter();

		markers.forEach((marker) => {
			let isMarkerInRange = false;
			let position = marker.position;
			let isFiltered = $filteredNakamals.some((nakamal) => {
				return nakamal._id === marker._id;
			});

			if (marker !== undefined && isFiltered === true) {
				if ($locateUser === true) {
					let distanceToCenter = google.maps.geometry.spherical.computeDistanceBetween(
						center,
						position
					);
					if (distanceToCenter < searchRadius) {
						isMarkerInRange = true;
					}
				} else if ($locateUser === false) {
					if (
						marker.position.lat() < mapBounds.getNorthEast().lat() &&
						marker.position.lng() < mapBounds.getNorthEast().lng() &&
						marker.position.lat() > mapBounds.getSouthWest().lat() &&
						marker.position.lng() > mapBounds.getSouthWest().lng()
					) {
						isMarkerInRange = true;
					}
				}
			}
			if (isMarkerInRange === true) {
				marker.setMap(map);
				inRange.push(marker._id);
			} else {
				marker.setMap(null);
			}
		});

		markerIDinRange.set(inRange);

		setTimeout(() => {
			areMarkersLoaded = true;
		}, 2000);
	};

	$: if (markers.length !== 0 && $selectedID !== '') {
		if (pointer !== undefined) {
			pointer.setIcon({
				path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
				scale: 4,
				strokeWeight: 0.5,
				strokeColor: '#FFF',
				fillOpacity: 0.9,
				fillColor: '#FF5F00'
			});
		}

		pointer = markers.find((marker) => {
			return marker._id === $selectedID;
		});

		pointer.setMap(map);

		pointer.setIcon({
			path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
			scale: 6,
			strokeWeight: 1,
			strokeColor: '#4D7C0F',
			fillOpacity: 0.8,
			fillColor: '#A3E635'
		});
		pointer.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(() => {
			pointer.setAnimation(null);
		}, 2000);

		map.setCenter(pointer.position);
	}

	// Locating user

	const toggleLocateUser = () => {
		locateUser.set(!$locateUser);
	};
</script>

<!-- <svelte:head>
	<script src="https://unpkg.com/@googlemaps/js-api-loader@1.0.0/dist/index.min.js"></script>
</svelte:head> -->

<div class="h-5/6 w-full relative">
	<div class="h-full w-full absolute">
		<div id="nakMap" class="h-full w-full bg-white relative" />
		{#if areMarkersLoaded === false}
			<div class="h-full w-full bg-gry-400 bg-opacity-60 absolute top-0">
				<div class="h-full relative">
					<Spinner />
				</div>
				{#if isMapMounted === true}
					<p
						class="w-full text-center uppercase font-logo text-xl text-white font-bold absolute bottom-1/4"
					>
						Loading markers
					</p>
				{:else}
					<p
						class="w-full text-center uppercase font-logo text-xl text-white font-bold absolute bottom-1/4"
					>
						Loading map
					</p>
				{/if}
			</div>
		{/if}
		{#if $selectedNakamal !== undefined}
			<div on:click={toggleDetails} class="max-w-2/3 absolute bottom-0 cursor-pointer">
				<div>
					<div
						class="flex bg-gradient-to-tr from-grn-700 to-grn-500 px-2 py-1 rounded-tr-2xl items-center"
					>
						<h3 class="text-white font-bold uppercase text-sm">{$selectedNakamal.title}</h3>
						<div on:click={toggleDetails} class="h-4 px-3 text-white cursor-pointer">
							<Icon icon="view" />
						</div>
					</div>
					<div class="bg-gradient-to-tr from-gry-200 to-white">
						<div class="flex space-x-4 justify-center ">
							<div class="flex text-sm items-center space-x-1">
								<div class="h-4 text-grn-600">
									<Icon icon="leaf" />
								</div>
								<p class="text-gry-600">
									{$selectedNakamal.reviews.kavStars}
								</p>
							</div>
							<div class="flex text-sm items-center space-x-1">
								<div class="h-4 text-org-500">
									<Icon icon="lightbulb" />
								</div>
								<p class="text-gry-600">
									{$selectedNakamal.reviews.nakStars}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
<div class="h-1/6 grid grid-cols-12">
	<div class="col-span-8 md:col-span-12 flex items-center">
		<button
			on:click={toggleLocateUser}
			class="text-white hover:bg-grn-600 py-1 px-1.5 rounded-md"
			class:bg-org-700={$locateUser}
		>
			<div class="h-4">
				<Icon icon="pin" />
			</div>
			<p class="text-xs whitespace-nowrap">Near me</p>
		</button>
		{#if $locateUser}
			<div transition:slide class="flex flex-col flex-grow">
				<p class="text-white font-bold text-center text-sm">
					{radiusInKm} km
				</p>
				<div class="w-11/12 mx-auto">
					<input type="range" min="0" max="10" step="0.5" class="w-full" bind:value={radiusInKm} />
				</div>
			</div>
		{/if}
	</div>

	<div class="col-span-4 md:hidden flex items-center">
		<Button
			on:click={() => {
				dispatch('toggleFilters');
			}}
		>
			<div class="h-5 mr-2">
				<Icon icon="filters" />
			</div>
			Filters
		</Button>
	</div>
</div>
