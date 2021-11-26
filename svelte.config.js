import preprocess from "svelte-preprocess";
import adapter from '@sveltejs/adapter-auto';
/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
		// hydrate the <div id="svelte"> element in src/app.html
        target: '#svelte',
        adapter: adapter(),
        // env variables
        vite: {
            define: {
                'process.env': process.env,
            },
        },
	},

    preprocess: [preprocess({
        postcss: true
    })]
};

export default config;
