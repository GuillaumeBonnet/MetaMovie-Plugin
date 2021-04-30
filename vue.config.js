// vue.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
	css: {
		extract: process.env.npm_lifecycle_event == 'build',
		loaderOptions: {
			scss: {
				// Prefer Dart Sass
				implementation: require('sass'),
				// See https://github.com/webpack-contrib/sass-loader/issues/804
				additionalData: `@use 'src/assets/styles/global-styles';`, // ain't working
				webpackImporter: false,
				sassOptions: {
					includePaths: ['./node_modules'],
				},
			},
		},
	},
	runtimeCompiler: true,
	filenameHashing: false,
	configureWebpack: {
		plugins: [
			new CopyWebpackPlugin([
				{ from: './src/manifest.json', to: 'manifest.json', flatten: true },
				{ from: './src/chrome-scripts/vue.js', to: 'vue.js', flatten: true },
			]),
		],
	},
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
			chunks: ['pop-up', 'chunk-vendors', 'chunk-common', 'index'],
		},
		['content-overlay']: {
			// entry for the page
			entry: 'src/content-overlay/content-overlay.ts',
		},
	},
	devServer: {
		contentBase: path.join(__dirname, 'dev-page'),
		https: true,
		public: 'https://localhost:8080',
		// hot: {
		// 	https: true,
		// },
	},
};
