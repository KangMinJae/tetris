const webpack = require('webpack');
const path = require('path');
require('babel-polyfill');

module.exports = {
    entry: ['babel-polyfill', path.resolve(__dirname, './src/js/tetris.js')],
    output: {
        path: path.resolve(__dirname, 'build/js'),
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};