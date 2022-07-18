import { writable, derived, type Writable, type Readable } from 'svelte/store';

import { fetchedReviews } from '$shared/nakamals';

export const user: Writable<User> = writable();

export const userList: Writable<User[]> = writable([]);

export const token: Writable<string> = writable('');

export const visitor: Writable<Visitor> = writable({
	username: '',
	email: '',
	password: '',
	confirmPassword: ''
});

export const review: Writable<Review> = writable();

export const responseDATA = writable();

export const isLoggedIn: Writable<boolean> = writable(false);

export const usersWithHistory: Readable<User> = derived(
	[userList, fetchedReviews],
	([users, reviews], set) => {
		users.forEach((user) => {
			user.reviews = reviews.filter((review) => {
				if (review.user_id === user._id) {
					return review;
				}
			});
		});
		set(users);
	}
);
