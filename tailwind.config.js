module.exports = {
	// purge: { //ENABLE TO TEST LOCALLY
	//   enabled: true,
	//   content: ['./src/**/*.html', './src/**/*.vue',],
	// },
	purge: ['./src/**/*.html', './src/**/*.vue'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			minWidth: {
				card: '15rem',
			},
			borderWidth: {
				'1': '1px',
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
		},
	},
	plugins: [],
};
