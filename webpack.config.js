'use strict';
let path = require('path');

module.exports = {
    entry: path.resolve('./js/main.js'),
    output: {
        path: path.resolve('./js'),
        filename: 'build.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }, resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    devServer: {
        port: 7000,
    }
}