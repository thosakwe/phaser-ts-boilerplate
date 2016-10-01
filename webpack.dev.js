var common = require('./webpack.common');
var path = require('path');
var webpack = require('webpack');
var WebpackErrorNotificationPlugin = require('webpack-error-notification');

common.devtool = 'eval';
common.entry = [
    'pixi.js/src',
    'phaser-shim',
    'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    path.join(__dirname, './src/main.ts') // Your appʼs entry point
];
common.output.sourceMapFilename = '[file].map';
common.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new WebpackErrorNotificationPlugin(),
    new webpack.NoErrorsPlugin()
];


module.exports = common;