import { writable, derived } from 'svelte/store'

const fetchedNakamals = writable([])

const fetchedProducers = writable([])

const fetchedReviews = writable([])

const reviewedNakamals = derived( [fetchedNakamals, fetchedReviews], ([nakamals, reviews], set) => {
        
        nakamals.forEach( (nakamal) => {

            let ratings = reviews.filter((review) => { if (review.nakamal === nakamal._id) {return review} });
            let numRatings = ratings.length;
            let kavRating = 0;
            let kavStars = 0;
            let nakRating = 0;
            let nakStars = 0;
            
            if (numRatings !== 0) {
                kavRating = Math.round(10 * ratings.reduce((total, vote) => total + vote.kava_rating, 0) / ratings.length)/10;
                kavStars = Math.round(kavRating);
                nakRating = Math.round(10 * ratings.reduce((total, vote) => total + vote.nakamal_rating, 0) / ratings.length)/10;
                nakStars = Math.round(nakRating);
            }

            nakamal.reviews = {
                ratings, numRatings, kavRating, kavStars,nakRating, nakStars
            }
        });

        set(nakamals);
    }
);

const reviewedProducers = derived( [fetchedProducers, fetchedReviews], ([nakamals, reviews], set) => {
        
        nakamals.forEach( (nakamal) => {

            let ratings = reviews.filter((review) => { if (review.nakamal === nakamal._id) {return review} });
            let numRatings = ratings.length;
            let kavRating = 0;
            let kavStars = 0;
            let nakRating = 0;
            let nakStars = 0;
            
            if (numRatings !== 0) {
                kavRating = Math.round(10 * ratings.reduce((total, vote) => total + vote.kava_rating, 0) / ratings.length)/10;
                kavStars = Math.round(kavRating);
                nakRating = Math.round(10 * ratings.reduce((total, vote) => total + vote.nakamal_rating, 0) / ratings.length)/10;
                nakStars = Math.round(nakRating);
            }

            nakamal.reviews = {
                ratings, numRatings, kavRating, kavStars,nakRating, nakStars
            }
        });

        set(nakamals);
    }
);

const selectedID = writable('');

const selectedNakamal = derived([reviewedNakamals, selectedID], ([nakamals, id], set) => {
        set(nakamals.find((nakamal) => {return nakamal._id === id}))
    }
);

const filterBy = writable({
    type: 'nakamal',
    country: 'all',
    city: 'all',
    kakaiTick: false,
    alcoholTick: false,
    tvTick: false,
    poolTick: false
});

const locateUser = writable(false);

const markerIDinRange = writable([]);

const filteredNakamals = derived([reviewedNakamals, filterBy, locateUser, markerIDinRange], ([nakamals, filters, locate, inRange], set) => {
        
        let filtered = nakamals
            .filter(nakamal => filters.country === 'all' ? true : nakamal.country === filters.country)
            .filter(nakamal => filters.city === 'all' ? true : nakamal.city === filters.city)
			.filter(nakamal => filters.kakaiTick === false ? true : nakamal.kakai === true)
			.filter(nakamal => filters.alcoholTick === false ? true : nakamal.alcohol === true)
			.filter(nakamal => filters.tvTick === false ? true : nakamal.tv === true)
			.filter(nakamal => filters.poolTick === false ? true : nakamal.pool === true)
            .filter(nakamal => locate === false ? true : inRange.some(id => id === nakamal._id))

        set(filtered);
    }
)


export { fetchedNakamals, fetchedReviews, reviewedNakamals, selectedID, selectedNakamal, filterBy, filteredNakamals, reviewedProducers, locateUser, markerIDinRange }