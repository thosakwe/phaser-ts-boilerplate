var common = require('./webpack.common');
var path = require('path');
var webpack = require('webpack');

common.entry = [
    'phaser-shim',
    path.join(__dirname, './src/main.ts')
];
common.plugins = [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
];


module.exports = common;