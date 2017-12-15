/**
 * Created by newhuan on 2017/6/13.
 */
//
/**
 * webpack-dev-server, uglifyjs-webpack-plugin => not need, can be uninstalled
 */
/**
 * dest floder can be built by webpack, so it is unnecessary to push it, add "\dest" in .gitignore file
 * however, if the file must be released, dest floder must be pushed;
 */
/**
 * jquery 1.9.1 and older can't be used
 * style-loader does not support ie7(oldest is ie8)
 * compile scss with webstorm
 * import jq1.9.1 with cnd
 * webpack is only used to compile js in es3 and run in ie5
 * also used to uglify js files and get source map
 * watch is too expensive , close it
 * dev-server is not necessary with webstorm
 * now es6 can be run in ie5
 * awesome!
*/
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        index: ['babel-polyfill', './js/index.js'],
    },
    output: {
        //while in windows here is: path: __dirname + "\\dist\\dest\\js",
        path: __dirname + "\/dest\/js",
        filename: '[name]compiled.js',
        publicPath: "./dest/js/",
    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "dist")
        ],
        alias: {
            //this is not correct
            // "Public$": path.resolve(__dirname, 'dist/js/public'),
        }
    }
    ,
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: ['es2015']
                }
            },
            // {
            //     test: /\.css$/,
            //     loader: 'style-loader!css-loader'
            // },
            // {//compile scss, oldest version that can be used is ie8
            //     test: /\.scss$/,
            //     include: __dirname + "\\dist\\css\\",
            //     loader: "style-loader!css-loader!sass-loader"
            // },
            // {//url-handler
            //     test: /\.(png|jpg)$/,
            //     loader: 'url-loader?limit=8192'
            // }
        ]
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    devtool: "source-map",//delete before release
    plugins: [
        new webpack.optimize.UglifyJsPlugin({//expensive close when dev
            sourceMap: true,//set false before release
            compress: {
                warnings: false,
                screw_ie8: false
            },
            mangle: {
                screw_ie8: false
            },
            output: {
                screw_ie8: false
            }
        }),
        // new webpack.ProvidePlugin({//在全局设置Push为Push
        //     Push: "push.js"
        // }),
    ]
};