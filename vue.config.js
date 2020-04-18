// vue.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	filenameHashing: false,
	configureWebpack: {
		plugins: [
		new CopyWebpackPlugin([
			{ from: './src/manifest.json', to: 'manifest.json', flatten: true },
			{ from: './src/chrome-scripts/vue.js', to: 'vue.js', flatten: true },
		]),
		]
	},
	transpileDependencies: [
		"vuetify"
	]
}