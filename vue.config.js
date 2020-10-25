// vue.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
	css: {
		extract: process.env.npm_lifecycle_event == 'build'
	},
	filenameHashing: false,
	configureWebpack: {
		plugins: [
			new CopyWebpackPlugin([
				{ from: './src/manifest.json', to: 'manifest.json', flatten: true },
				{ from: './src/chrome-scripts/vue.js', to: 'vue.js', flatten: true }
			]),
		]
	},
	transpileDependencies: [
		"vuetify"
	],
	pages: {
		['pop-up']: {
			// entry for the page
			entry: 'src/pop-up/pop-up.ts',
			// the source template
			template: 'src/pop-up/pop-up.html',
			// output as dist/index.html
			filename: 'pop-up.html',
			// when using title option,
			// template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
			title: 'Pop-Up Page',
			// chunks to include on this page, by default includes
			// extracted common chunks and vendor chunks.
			chunks: ['pop-up', 'chunk-vendors', 'chunk-common', 'index']
		},
		['overlay']: {
			// entry for the page
			entry: 'src/content-overlay/overlay.ts',
		},
	},
	devServer: {
		contentBase: path.join(__dirname, 'dev-page')
	}
}