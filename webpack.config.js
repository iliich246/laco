const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    //mode: 'production',
    entry: {
        //landing_builder: './src/es6/landing-skeleton.js',
        //app: './src/es6/app.js',
        app: [
            "./src/es6/classes/FrameInterface",
            "./src/es6/classes/LandingFrame",
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'laco.js',
        library: 'LACO',
        libraryTarget: 'umd'
        //chunkFilename: 'js/[name].bundle.js',
        //filename: '[name].[contenthash].bundle.js'
    },
    externals: {
        lodash: {
           commonjs: 'lodash',
           commonjs2: 'lodash',
           amd: 'lodash',
           root: '_'
         }
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        open: false,
        port: 5000
    },
    optimization: {
        // moduleIds: 'hashed',
        // runtimeChunk: 'single',
        // splitChunks: {
        //     cacheGroups: {
        //         vendor: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: 'vendors',
        //             chunks: 'all'
        //         },
        //         lb: {
        //             test: './src/es6/landing-skeleton.js',
        //             name: 'lb',
        //             chunks: 'all',
        //         }
        //     }
        // },
         minimizer: [
             // new UglifyJsPlugin({
             //     extractComments: false,
             //     uglifyOptions: {
             //         output: {
             //             comments: false
             //         }
             //     }
             // }),
        //     //new TerserJSPlugin({}),
             //new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/assets/index.html",
            filename: "./index.html"
        }),
        // new MiniCssExtractPlugin({
        //     filename: "css/[name].bundle.css",
        //     chunkFilename: "css/[id].bundle.css"
        // }),
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     _: "lodash",
        //     jQuery: "jquery",
        //     "window.jQuery": "jquery"
        // }),
        // new webpack.DefinePlugin({
        //     PRODUCTION: JSON.stringify(false),
        // }),
        // new CopyPlugin([
        //     {
        //         from: './src/assets/img', to: 'img'
        //     }
        // ]),
    ],
    module: {
        rules: [
            {
                test: /\.?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            //minimize: true
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it uses publicPath in webpackOptions.output
                            publicPath: '../',
                            //hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            strictMath: true,
                            noIeCompat: true,
                        },
                    },
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'fonts',
                    name: '[name].[ext]',
                },
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'img',
                    //name: '[name].[ext]',
                },
            }
        ],
    }
};