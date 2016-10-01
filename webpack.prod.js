var common = require('./webpack.common');
var path = require('path');
var webpack = require('webpack');

common.devtool = 'eval';
common.entry = [
    'phaser-shim',
    path.join(__dirname, './src/main.ts')
];
common.outut.sourceMapFilename = '[file].map';
common.plugins = [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
];


module.exports = common;