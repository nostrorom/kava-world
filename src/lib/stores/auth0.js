import { writable } from 'svelte/store';

export const auth0client = writable(null);
export const isAuthenticated = writable(false);
export const auth0user = writable({});
export const popupOpen = writable(false);
export const error = writable();
