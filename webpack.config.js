const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");
const postCssLoader = {
    loader: "postcss-loader",
    options: {
        plugins: () => {
            return [
                autoprefixer({
                    browsers: [
                        "last 2 versions"
                    ]
                })
            ];
        }
    }
};

module.exports = {
    entry: './client.js',
    output: {
        path: path.resolve('build'),
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react'],
                    plugins: [
                        'transform-decorators-legacy',
                        "transform-object-rest-spread",
                        "transform-class-properties",
                        "transform-export-extensions"
                    ]
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        "css-loader",
                        postCssLoader,
                    ],
                }),
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        "css-loader",
                        postCssLoader,
                        "sass-loader",
                    ],
                }),
            },
            {
                test: [/\.html$/, /\.temp$/],
                loader: "html-loader"
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: false,
        }),
        new ExtractTextPlugin({
            filename: "[name].css",
            allChunks: true,
        }),
    ]
};
