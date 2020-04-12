const path = require('path');
module.exports = {
    mode: "production", // "production" | "development"
    // Chosen mode tells webpack to use its built-in optimizations accordingly.
    entry: {
        background: ['./src/chrome-scripts/background.ts'],
        content: ['./src/chrome-scripts/content.ts'],
    },
    output: {
        // options related to how webpack emits results
        path: path.resolve(__dirname, "dist/chrome-scripts"), // string
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)
        filename: "[name].js", // string
        // the filename template for entry chunks
        library: 'lib',

    },
    module: {
        // configuration regarding modules
        rules: [
            // rules for modules (configure loaders, parser options, etc.)
            {
                test: /\.ts?$/,
                include: [
                    path.resolve(__dirname, "src/chrome-scripts")
                ],
                loader: "ts-loader",
            },
        ]
    },
    resolve: {
        // options for resolving module requests
        // (does not apply to resolving to loaders)
        modules: [
            "node_modules",
            path.resolve(__dirname, "node_modules")
        ],
        // directories where to look for modules
        extensions: [".js", ".json", ".jsx", ".css"],
    },
    plugins: [
    ],
}