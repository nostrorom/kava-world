import { writable, derived } from 'svelte/store';

import { fetchedReviews } from '$lib/stores/nakamals';

export const user = writable({});

export const userList = writable([]);

export const token = writable('');

export const visitor = writable({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
});

export const review = writable();

export const responseDATA = writable();

export const isLoggedIn = writable(false);

export const usersWithHistory = derived([userList, fetchedReviews], ([users, reviews], set) => {

    users.forEach((user) => {
        user.reviews = reviews.filter((review) => {
            if (review.user_id === user._id) { return review }
        });
    });
    set(users);
})