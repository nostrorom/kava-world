<script>
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import Icon from '$lib/components/UI/Icon.svelte';
	import Button from '$lib/components/UI/Button.svelte';
	import Spinner from '$lib/components/UI/Spinner.svelte';
	// import { Loader } from '@googlemaps/js-api-loader';
	import * as pkg from '@googlemaps/js-api-loader';

	const { Loader } = pkg;
	const dispatch = createEventDispatcher();

	const toggleDetails = () => {
		dispatch('toggleDetails');
	};

	import {
		filteredNakamals,
		reviewedNakamals,
		markerIDinRange,
		mapCenter,
		selectedID,
		selectedNakamal,
		usePosition,
		filterBy,
		closestNak
	} from '$lib/stores/nakamals';

	export let mapDiv;

	let map;
	let isMapScriptLoaded = false;
	let isMapMounted = false;
	let areMarkersLoaded = false;
	// let mapCoords = { nor: '', est: '', sth: '', wst: '' };
	let mapBounds;

	let markers = [];
	let pointer;
	let userMarker;

	let yumiwork = { lat: -17.738600749041584, lng: 168.31435099901404 };
	let startPos;
	let searchArea;
	let radiusInKm = 2;
	$: searchRadius = radiusInKm * 1000;

	// Load script and initiate map

	$: if (typeof window !== 'undefined') {
		let loader = new Loader({
			apiKey: process.env.MAP_API_KEY,
			version: 'weekly',
			libraries: ['geometry']
		});

		initiateMap(loader);
	}

	const initiateMap = (loader) => {
		loader.loadCallback((err) => {
			if (err) {
				console.log(err.message);
			} else if (document.getElementById(`${mapDiv}`) === null) {
				setTimeout(() => {
					initiateMap(loader);
				}, 1);
			} else {
				startPos = yumiwork;

				map = new google.maps.Map(document.getElementById(`${mapDiv}`), {
					center: yumiwork,
					zoom: 13,
					streetViewControl: true
				});

				userMarker = new google.maps.Marker({
					position: startPos,
					map,
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

	$: if (isMapScriptLoaded) {
		google.maps.event.addListener(map, 'bounds_changed', () => {
			mapBounds = map.getBounds();
		});

		// console.log('%cbounds changed', 'color:magenta');

		if (mapBounds !== undefined) {
			isMapMounted = true;
		}
		displayMarkers();
	}

	// Reacting to map center change

	$: if (isMapMounted) {
		map.setCenter($mapCenter);
	}

	$: console.log('mapcenter', $mapCenter);

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
		if ($usePosition === true) {
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
		closestNak.set({
			_id: null,
			distance: 20000000
		});

		// console.log($closestNak);
		let inRange = [];

		markers.forEach((marker) => {
			let isMarkerInRange = false;
			let distanceToStartPos = google.maps.geometry.spherical.computeDistanceBetween(
				startPos,
				marker.position
			);
			let isFiltered = $filteredNakamals.some((nakamal) => {
				return nakamal._id === marker._id;
			});

			if (distanceToStartPos < $closestNak.distance && marker) {
				closestNak.set({
					_id: marker._id,
					distance: distanceToStartPos
				});
				// console.log($closestNak);
			}

			if (marker !== undefined && isFiltered === true) {
				if ($usePosition === true) {
					if (distanceToStartPos < searchRadius) {
						isMarkerInRange = true;
					}
				} else if ($usePosition === false && mapBounds !== null) {
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
			if (marker._id === $selectedID) {
				marker.setMap(null);
			}
		});

		markerIDinRange.set(inRange);

		$closestNak.nakamal = $reviewedNakamals.find((nakamal) => {
			return nakamal._id === $closestNak._id;
		});
		$closestNak.distanceInKm = Math.round($closestNak.distance / 100) / 10;

		setTimeout(() => {
			areMarkersLoaded = true;
		}, 1500);
	};

	// $: console.log($closestNak.nakamal);

	$: if (markers.length !== 0 && $selectedID !== '') {
		if (pointer === undefined) {
			pointer = new google.maps.Marker({
				position: {
					lat: $selectedNakamal.gps_lat,
					lng: $selectedNakamal.gps_lng
				},
				type: $selectedNakamal.type,
				map,
				options: { title: $selectedNakamal.title },
				_id: $selectedNakamal._id,
				icon: {
					path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
					scale: 6,
					strokeWeight: 1,
					strokeColor: '#4D7C0F',
					fillOpacity: 0.8,
					fillColor: '#A3E635'
				}
			});
		} else {
			pointer.setPosition({
				lat: $selectedNakamal.gps_lat,
				lng: $selectedNakamal.gps_lng
			});
		}

		setTimeout(() => {
			pointer.setAnimation(google.maps.Animation.BOUNCE);
		}, 1000);
		setTimeout(() => {
			pointer.setAnimation(null);
		}, 2000);

		// map.setCenter(pointer.position);
	}

	// Locating user

	const locateUser = () => {
		usePosition.set(true);
		if (navigator.geolocation) {
			const success = (position) => {
				startPos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};

				// map.setCenter(startPos);
				mapCenter.set(startPos);
				positionUser(startPos);

				// route['origin'] = new_position;
			};

			const error = () => {
				alert('Sorry, something went wrong. Please retry');
			};

			navigator.geolocation.getCurrentPosition(success, error);
		}
	};

	const locateYumiwork = () => {
		usePosition.set(true);
		startPos = yumiwork;
		// map.setCenter(startPos);
		mapCenter.set(startPos);
		positionUser(startPos);
	};

	const positionUser = (pos) => {
		userMarker.setPosition(pos);
		userMarker.setAnimation(google.maps.Animation.BOUNCE);
		searchArea.setCenter(pos);
		setTimeout(() => {
			userMarker.setAnimation(null);
		}, 1500);
	};
</script>

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
			<div on:click={toggleDetails} class="max-w-1/3 absolute bottom-0 cursor-pointer">
				<div>
					<div
						class="flex bg-gradient-to-tr from-grn-700 to-grn-500 px-1 py-0.5 rounded-tr-2xl items-center text-sm"
					>
						<h3 class="text-white font-bold uppercase text-xs md:text-sm">
							{$selectedNakamal.title}
						</h3>
						<div class="h-4 px-3 text-white cursor-pointer">
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
			on:click={locateYumiwork}
			class="text-white hover:bg-grn-600 py-1 px-1.5 rounded-md"
			class:bg-org-700={$usePosition && startPos === yumiwork}
		>
			<div class="h-4">
				<Icon icon="pin" />
			</div>
			<p class="text-xs whitespace-nowrap">Port Vila</p>
		</button>
		<button
			on:click={locateUser}
			class="text-white hover:bg-grn-600 py-1 px-1.5 rounded-md"
			class:bg-org-700={$usePosition && startPos !== yumiwork}
		>
			<div class="h-4">
				<Icon icon="pin" />
			</div>
			<p class="text-xs whitespace-nowrap">Near me</p>
		</button>
		{#if $usePosition}
			<div transition:slide class="flex flex-col flex-grow">
				<p class="text-white font-bold text-center text-sm">
					{radiusInKm} km
				</p>
				<div class="w-11/12 mx-auto">
					<input type="range" min="0" max="10" step="0.5" class="w-full" bind:value={radiusInKm} />
				</div>
			</div>
			<button
				on:click={() => {
					usePosition.set(false);
				}}
				class="text-white hover:bg-grn-600 py-1 px-1.5 rounded-md"
			>
				<div class="h-4">
					<Icon icon="close" />
				</div>
				<p class="text-xs whitespace-nowrap">Stop GPS</p>
			</button>
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
