// vue.config.js
const path = require('path');
const fs = require('fs');

module.exports = {
	// lintOnSave: false,
	css: {
		extract: process.env.npm_lifecycle_event == 'build',
		loaderOptions: {
			scss: {
				// Prefer Dart Sass
				implementation: require('sass'),
				// See https://github.com/webpack-contrib/sass-loader/issues/804
				webpackImporter: false,
				sassOptions: {
					includePaths: [path.resolve(__dirname, 'node_modules')],
				},
			},
		},
	},
	runtimeCompiler: true,
	filenameHashing: false,
	configureWebpack: {
		plugins: [],
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
		https: {
			key: fs.readFileSync('dev-page/certs/localhost.key'),
			cert: fs.readFileSync('dev-page/certs/localhost.crt'),
			// ca: fs.readFileSync('/path/to/ca.pem'),
		},
		historyApiFallback: {
			rewrites: [
				{ from: '/watch/.', to: '/dev-page.html' },
				{ from: '/home', to: '/dev-page.html' },
			],
		},
		public: 'https://localhost:8080',
	},
};
