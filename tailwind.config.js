const plugin = require('tailwindcss/plugin');
module.exports = {
	purge: ['./src/**/*.html', './src/**/*.vue'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		namedGroups: ['menuItem', 'currentDeckAction'],
		extend: {
			minWidth: {
				card: '20rem',
			},
			borderWidth: {
				'1': '1px',
			},
			inset: {
				'3.5em': '3.5em',
			},
		},
	},
	variants: {
		extend: {
			height: ['hover', 'group-hover'],
			width: ['hover', 'group-hover'],
			scale: ['hover', 'group-hover'],
			margin: ['hover', 'group-hover'],
			padding: ['hover', 'group-hover'],
			textColor: ['active'],
			fontSize: ['hover', 'group-hover'],
			borderWidth: ['hover', 'group-hover'],
			borderColor: ['hover', 'group-hover', 'active'],
			display: ['hover', 'group-hover', 'active'],
			translate: ['hover', 'group-hover', 'active'],
			transitionProperty: ['hover', 'group-hover', 'active'],
			transitionDelay: ['hover', 'group-hover', 'active'],
		},
	},
	plugins: [
		require('tailwindcss-named-groups'),
		plugin(function({ addUtilities }) {
			for (let i = 0; i <= 100; i++) {
				addUtilities({
					[`.w-screen${i}`]: {
						width: `${i}vw`,
					},
				});
				addUtilities({
					[`.h-screen${i}`]: {
						height: `${i}vh`,
					},
				});
				addUtilities({
					[`.mh-screen${i}`]: {
						['max-height']: `${i}vh`,
					},
				});
			}
			for (let i = 1000000; i <= 1000000 + 60; i += 10) {
				addUtilities({
					[`.z-${i}`]: {
						['z-index']: `${i} !important`,
					},
				});
			}
		}),
	],
};
