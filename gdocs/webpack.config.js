const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const GasPlugin = require("gas-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackShellPlugin = require('webpack-shell-plugin');
const CreateFilePlugin = require('webpack-create-file-plugin');
const GAppsJSWrapperPlugin = require("./myplugins");

// Read Samples first
function readdir(path) {
    var items = fs.readdirSync(path);
    return items.map(function(item) {
        var file = path;
        if (item.startsWith("/") || file.endsWith("/")) {
            file += item;
        } else {
            file += ('/' + item);
        }
        var stats = fs.statSync(file);
        return {'file': file, 'name': item, 'stats': stats};
    });
}

module.exports = (env, options) => {
    console.log("Options: ", options);
    var isDevelopment = options.mode == "development"
    var plugins = [
        new GasPlugin(),
        // new uglifyJsPlugin(),
        // new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
        new CopyPlugin([
            {
                from: path.resolve(__dirname, 'appsscript.json'),
                to: 'appsscript.json'
            },
            {
                from: path.resolve(__dirname, 'server/'),
                to: 'server/'
            },
            {
                from: path.resolve(__dirname, 'client/index.gdocs.html'), to: 'client/index.gdocs.html'
            },
            {
                from: path.resolve(__dirname, 'client/ext.html'), to: 'client/ext.html'
            },
            {
                from: path.resolve(__dirname, 'client/body.html'), to: 'client/body.html'
            }
        ]),
        new MiniCssExtractPlugin({
            filename: isDevelopment ? '[name].css' : '[name].[hash].css',
            chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
        }),
        /*
        new HTMLWebpackPlugin({
            title: "Blog Central",
            myPageHeader: "Blog Central",
            template: path.resolve(__dirname, 'client/index.gdocs.ejs'),
            filename: "client/index.gdocs.html"
        }),
        */
        new HTMLWebpackPlugin({
            title: "Blog Central",
            myPageHeader: "Blog Central",
            chunks: ['flask'],
            template: path.resolve(__dirname, 'client/index.flask.html'),
            filename: "client/index.flask.html"
        }),
        new GAppsJSWrapperPlugin({ source: "client/index.gdocs.js" }),
        new GAppsJSWrapperPlugin({ source: "client/index.flask~gdocs.js" }),
        /*
        new HTMLWebpackIncludeAssetsPlugin({
            files: [ "client/index.flask.html", "client/index.gdocs.html" ],
            assets: [
                "./client/css/styles.css"
            ],
            append: true
        })
        */
        // new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }),
        // new webpack.HotModuleReplacementPlugin()
    ];
    if (options.mode == "production") {
        // plugins.splice(0, 0, new uglifyJsPlugin());
    } else if (options.debug) {
    }

    var output = {
        library: 'BCJS',
        libraryTarget: 'this',
        libraryExport: 'default',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/static",
        filename: 'client/index.[name].js'
    };

    var webpack_configs = {
        entry: {
            gdocs: "./client/index.gdocs.ts",
            flask: "./client/index.flask.ts"
        },
        optimization: {
            splitChunks: {
                chunks: 'all'
            },
        },
        output: output,
        module: {
            rules: [
                // The rule for rendering html from an ejs template.
                {
                  test: /\/client\/index.*.ejs$/,
                  use: [{
                    loader: 'extract-loader'
                  },
                  {
                    loader: 'html-loader',
                    options: {
                      // interpolate: 'require'
                    }
                  },
                  {
                    loader: 'render-template-loader',
                    options: {
                      engine: 'ejs',
                      locals: {
                        title: 'Render Template Loader',
                        desc: 'Rendering templates with a Webpack loader since 2017'
                      },
                      engineOptions: function (info) {
                        // Ejs wants a filename for partials rendering.
                        // (Configuring a "views" option can also be done.)
                        return { filename: info.filename }
                      }
                    }
                  }]
                },
                // { test: /\.handlebars$/, loader: "handlebars-loader" },
                // The rule for rendering page-hbs.html from a handlebars template.
                {
                  test: /\.hbs$/,
                  use: [{
                    loader: 'file-loader?name=[name]-[ext].html'
                  },
                  {
                    loader: 'extract-loader'
                  },
                  {
                    loader: 'render-template-loader',
                    options: {
                      engine: 'handlebars',
                      init: function (engine, info) {
                        engine.registerPartial(
                          'body',
                          fs.readFileSync('./client/body.hbs').toString()
                        )
                      },
                      locals: {
                        title: 'Rendered with Handlebars!',
                        desc: 'Partials Support'
                      },
                    }
                  }]
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                },
                {
                    test: /\.ts$/,
                    exclude: [
                        /node_modules/,
                        /server/,
                    ],
                    use: ['ts-loader']
                },
                /*
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader', 
                        'css-loader', 
                        'postcss-loader', 
                        'sass-loader'
                    ]
                },*/
                {
                    test: /\.module\.s(a|c)ss$/,
                    loader: [
                      isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                      {
                        loader: 'css-loader',
                        options: {
                          modules: true,
                          sourceMap: isDevelopment
                        }
                      },
                      {
                        loader: 'sass-loader',
                        options: {
                          sourceMap: isDevelopment
                        }
                      }
                    ]
                },
                {
                    test: /\.s(a|c)ss$/,
                    exclude: /\.module.(s(a|c)ss)$/,
                    loader: [
                      isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                      'css-loader',
                      {
                        loader: 'sass-loader',
                        options: {
                          sourceMap: isDevelopment
                        }
                      }
                    ]
                },
                /*
                {
                    test: /\.css$/,
                    loaders: ["style-loader","css-loader"]
                },
                */
                {
                    test: /\.(jpe?g|png|gif)$/i,
                    loader:"file-loader",
                    options:{
                        name:'[name].[ext]',
                        publicPath: "/static/assets/images/",
                        outputPath: "assets/images/"
                        //the images will be emited to dist/assets/images/ folder
                    }
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [ 'url-loader' ]
                }
            ]
        },
        plugins: plugins,
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss']
        }
    };
    if (options.debug || options.dev) {
        webpack_configs.devtool = 'inline-source-map';
        webpack_configs.resolve = { extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'] };
    }
    return webpack_configs;
};

