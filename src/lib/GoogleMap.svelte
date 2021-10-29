<script>
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/UI/Button.svelte';
	import Spinner from '$lib/UI/Spinner.svelte';
	import { Loader } from '@googlemaps/js-api-loader';

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
		locateUser
	} from '../stores/nakamals';
	import Icon from './UI/Icon.svelte';

	export let mapDiv;

	const loader = new Loader({
		apiKey: process.env.MAP_API_KEY,
		version: 'weekly',
		libraries: ['geometry']
	});

	let map;
	let isMapLoaded = false;
	let areMarkersLoaded = false;
	let mapCoords = { nor: '', est: '', sth: '', wst: '' };
	let mapBounds;

	let fetchedMarkers = [];
	let pointer;
	let userMarker;

	let startPos;
	let yumiwork = { lat: -17.738600749041584, lng: 168.31435099901404 };
	let searchArea;
	let radiusInKm = 2;
	$: displayRadius = radiusInKm * 1000;

	// Load and initiate map

	if (typeof window !== 'undefined') {
		loader.loadCallback((err) => {
			if (err) {
				console.log(err);
			} else {
				isMapLoaded = true;

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
					map,
					center: startPos,
					radius: displayRadius
				});
			}
		});
	}

	// Update map bounds and search area

	$: if (isMapLoaded) {
		google.maps.event.addListener(map, 'bounds_changed', () => {
			mapBounds = map.getBounds();
			mapCoords.nor = mapBounds.getNorthEast().lat();
			mapCoords.est = mapBounds.getNorthEast().lng();
			mapCoords.sth = mapBounds.getSouthWest().lat();
			mapCoords.wst = mapBounds.getSouthWest().lng();
			searchArea.setCenter(map.getCenter());
		});
	}

	// Update circle size

	const toggleLocateUser = () => {
		locateUser.set(!locateUser);
	};

	$: if (isMapLoaded) {
		searchArea.setRadius(displayRadius);
	}

	// Define markers

	$: if (isMapLoaded && $reviewedNakamals.length !== 0) {
		fetchedMarkers = $reviewedNakamals
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

	// Set markers to map

	$: if (fetchedMarkers.length !== 0) {
		let inRange = [];
		let center = map.getCenter();

		fetchedMarkers.forEach((marker) => {
			let position = marker.position;
			let distanceToCenter = google.maps.geometry.spherical.computeDistanceBetween(
				center,
				position
			);

			if (
				marker !== undefined &&
				$filteredNakamals.some((nakamal) => nakamal._id === marker._id) &&
				distanceToCenter < displayRadius
			) {
				marker.setMap(map);
				inRange.push(marker._id);
			} else {
				marker.setMap(null);
			}
		});

		markerIDinRange.set(inRange);
		areMarkersLoaded = true;
	}

	$: if ($selectedID !== '') {
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

		pointer = fetchedMarkers.find((marker) => marker._id === $selectedID);

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
	}
</script>

<div class="h-5/6 w-full relative">
	<div class="h-full w-full absolute">
		<div id="nakMap" class="h-full w-full bg-white relative" />
		{#if areMarkersLoaded === false}
			<div class="h-full w-full bg-gry-400 bg-opacity-60 absolute top-0">
				<div class="h-full relative">
					<Spinner />
				</div>
				{#if isMapLoaded === true}
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
			<div class="w-2/3 flex absolute bottom-0 ">
				<div
					class="flex bg-gradient-to-tr from-grn-700 to-grn-500 px-2 py-1 rounded-tr-2xl items-center"
				>
					<h3 class="text-white font-bold uppercase text-sm">{$selectedNakamal.title}</h3>
					<div on:click={toggleDetails} class="h-5 px-3 text-white cursor-pointer">
						<Icon icon="view" />
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
<div class="h-1/6 flex items-center w-full">
	<div class="w-2/3 h-full md:w-full flex items-center">
		<div class="p-0.5">
			<button
				on:click={() => {
					locateUser.set(true);
				}}
				class="text-white hover:bg-grn-500 py-1 px-1.5 rounded-md"
				class:bg-org-700={$locateUser}
			>
				<div class="h-4">
					<Icon icon="pin" />
				</div>
				<p class="text-xs whitespace-nowrap">Near me</p>
			</button>
		</div>

		<div class="p-2">
			<p class="text-white font-bold text-center text-sm">
				{radiusInKm} km
			</p>
			<input
				type="range"
				min="0"
				max="10"
				step="0.5"
				bind:value={radiusInKm}
				class="bg-orange-600 texy-white whitesace-nowrap text-lg font-bold items-center justify-center"
			/>
		</div>
	</div>

	<div class="w-1/3 md:hidden">
		<Button
			on:click={() => {
				dispatch('toggleFilters');
			}}
		>
			<div class="h-5 mr-2">
				<Icon icon="menu" />
			</div>
			Filters
		</Button>
	</div>
</div>
