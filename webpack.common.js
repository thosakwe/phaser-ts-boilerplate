var path = require('path');

module.exports = {
    module: {
        loaders: [
            {
                test: /\.ts?$/,
                loader: 'ts',
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                loader: 'script',// script-loader
                test: /(pixi|phaser).js/
            }]
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
    },
};
