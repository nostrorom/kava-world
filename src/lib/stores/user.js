import { writable } from 'svelte/store';

export const user = writable({});

export const user_data = writable([]);

export const token = writable('');

export const visitor = writable({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
});

export const review = writable();

export const responseDATA = writable();

