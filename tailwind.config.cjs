/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				org: {
					500: '#ff5f00',
					400: '#ff7700',
					601: '#f45a00',
					600: '#e35501',
					700: '#d14f02',
					800: '#b94704',
					900: '#993b05'
				},
				grn: colors.lime,
				gry: colors.stone
			}
		},

		fontFamily: {
			logo: 'Poor Story',
			main: 'Mulish'
		}
		// colors: {
		// 	org: {
		// 		500: '#ff5f00',
		// 		400: '#ff7700',
		// 		601: '#f45a00',
		// 		600: '#e35501',
		// 		700: '#d14f02',
		// 		800: '#b94704',
		// 		900: '#993b05'
		// 	},
		// 	grn: colors.lime,
		// 	gry: colors.stone,
		// 	white: colors.white,
		// 	black: colors.black,
		// 	red: colors.red,
		// 	orange: colors.orange,
		// 	amber: colors.amber,
		// 	yellow: colors.yellow,
		// 	green: colors.green,
		// 	lime: colors.lime,
		// 	emerald: colors.emerald,
		// 	teal: colors.teal,
		// 	cyan: colors.cyan,
		// 	skyblue: colors.sky,
		// 	blue: colors.blue,
		// 	indigo: colors.indigo,
		// 	violet: colors.violet,
		// 	purple: colors.purple,
		// 	fuchsia: colors.fuchsia,
		// 	pink: colors.pink,
		// 	rose: colors.rose,
		// 	blueGray: colors.slate,
		// 	coolGray: colors.zinc,
		// 	gray: colors.gray,
		// 	trueGray: colors.neutral,
		// 	warmGray: colors.stone
		// }
	},
	plugins: []
};
