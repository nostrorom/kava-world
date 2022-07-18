/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}

interface User {
	_id: string;
	username: string;
	reviews?: Review[];
}

interface Visitor {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface Review {
	user_username: string;
	user_id: string;
	nakamal_id: string;
	nakamal_name: string;
	kava_rating: number;
	nakamal_rating: number;
	comment: string;
	numRatings: number;
	kavRating: number;
	kavStars: number;
	nakRating: number;
	nakStars: number;
}

interface Nakamal {
	_id: string;
	gps_lat: string;
	gps_lng: string;
	country: string;
	city: string;
	kakai: boolean;
	alcohol: boolean;
	tv: boolean;
	pool: boolean;
	reviews: {
		ratings: Review[];
		numRatings: number;
		kavRating: number;
		kavStars: number;
		nakRating: number;
		nakStars: number;
	};
}

interface UserFilters {
	type: string;
	country: string;
	city: string;
	kakaiTick: boolean;
	alcoholTick: boolean;
	tvTick: boolean;
	poolTick: boolean;
	nakStars: number;
	kavStars: number;
	sortBy: {
		rating: string;
		order: string;
	};
}

interface Marker {
	sup: string;
}
