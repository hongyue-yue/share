const { version } = require("./package.json")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")
const PORT = process.env.PORT || 3000
const ENV = process.env.NODE_ENV || "development"
const ROOT_PATH = path.resolve(__dirname)
const APP_PATH = path.resolve(ROOT_PATH, "src")
const BUILD_PATH = path.resolve(ROOT_PATH, "dist")
const CDN = "./"
const __PUBLIC__ = ENV == "production" ? CDN : ""
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

// var OfflinePlugin = require('offline-plugin');

// var ExtractTextPlugin = require("extract-text-webpack-plugin")
// var extractLESS = new ExtractTextPlugin({
//     filename: "[name].[chunkhash:5].css",
//     disable: false,
//     allChunks: true
// })
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
var chalk = require("chalk")
//定义了一些文件夹的路径
var CleanWebpackPlugin = require("clean-webpack-plugin")
// var FastUglifyJsPlugin = require("fast-uglifyjs-plugin")
var CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
    mode: ENV === "production" ? "production" : "development",
    entry: {
        app: ["babel-polyfill", APP_PATH + "/tpl.js"]
    },
    resolve: {
        alias: {
            component: APP_PATH + "/component/",
            css: APP_PATH + "/css",
            js: APP_PATH + "/js"
        },
        extensions: [".js", ".jsx", ".json", ".less", ".png"]
    },
    output: {
        path: BUILD_PATH,
        filename:
            ENV === "production" ? "[name].[chunkhash:5].js" : "[name].js",
        chunkFilename:
            ENV === "production" ? "[id].[chunkhash:5].js" : "[id].js",
        publicPath: __PUBLIC__
        // crossOriginLoading:'anonymous',
    },
    module: {
        rules: [
            {
                test: /\.(css|less)?$/,
                // include: [APP_PATH],
                use: [
                    ENV === "production"
                        ? MiniCssExtractPlugin.loader
                        : "style-loader",
                    "css-loader?sourceMap=true",
                    {
                        loader: "postcss-loader",
                        options: {
                            importLoaders: 1,
                            sourceMap: true,
                            ident: "postcss",
                            plugins: loader => [
                                require("autoprefixer")({
                                    browsers: ["iOS >= 8", "Android >= 4"]
                                })
                            ]
                        }
                    },
                    `less-loader?{"sourceMap":true,"javascriptEnabled": true}`,
                    "fit-zero-point-five-px-border-loader"
                ]
            },
            {
                test: /\.jsx?$/,
                include: [APP_PATH],
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "env",
                                {
                                    targets: {
                                        browsers: ["iOS >= 8", "Android >= 4"]
                                    },
                                    modules: false,
                                    loose: true,
                                    debug: true,
                                    useBuiltIns: true
                                }
                            ],
                            "react",
                            "stage-0"
                        ],
                        plugins: [
                            "transform-runtime",
                            "transform-decorators-legacy",
                            [
                                "import",
                                {
                                    libraryName: "antd-mobile",
                                    libraryDirectory: "es",
                                    style: true
                                }
                            ]
                        ],
                        cacheDirectory: require("os").tmpdir() + "/babel-cache"
                    }
                }
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=200&minetype=application/font-woff",
                include: [APP_PATH]
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=200&minetype=application/font-woff",
                include: [APP_PATH]
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=200&minetype=application/octet-stream",
                include: [APP_PATH]
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: "file-loader",
                include: [APP_PATH]
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=200&minetype=image/svg+xml"
            },
            {
                test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
                use: "url-loader?limit=200&name=[name].[hash:5].[ext]",
                include: [APP_PATH],
                exclude: [
                    path.resolve(
                        APP_PATH,
                        "page",
                        "RedEnvelope",
                        "rain",
                        "resource",
                        "img",
                        "all.png"
                    ),
                    path.resolve(
                        APP_PATH,
                        "page",
                        "RedEnvelope",
                        "rain",
                        "resource",
                        "img",
                        "loading.png"
                    )
                ]
            },
            {
                test: /\.json/,
                use: "json-loader?name=[name].[hash:5].[ext]",
                type: "javascript/auto",
                include: [APP_PATH]
            }
        ]
    },
    plugins: [
        // new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(ENV)
            },
            __VERSION__: JSON.stringify(version),
            __DEV__: ENV !== "production",
            __BASEURL__: JSON.stringify("/merchantWalletWeb/h5")
        }),
        new HtmlWebpackPlugin({
            title: "",
            template: APP_PATH + "/tpl.html",
            __PUBLIC__: __PUBLIC__,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            filename: "index.html",
            chunks: ["app", "manifest", "libs~app", "vendor~app"]
        })
    ].concat(
        ENV === "production"
            ? [
                  new MiniCssExtractPlugin({
                      // Options similar to the same options in webpackOptions.output
                      // both options are optional
                      filename: "[name].[chunkhash:5].css",
                      chunkFilename: "[id].[chunkhash:5].css"
                  }),
                  new CleanWebpackPlugin([BUILD_PATH])
              ]
            : [
                  //   new webpack.DllReferencePlugin({
                  //       context: path.resolve(ROOT_PATH, "dll"),
                  //       manifest: require(ROOT_PATH + "/dll/manifest.json")
                  //   }),
                  new webpack.ProgressPlugin((percentage, msg) => {
                      const stream = process.stderr
                      if (stream.isTTY && percentage < 1) {
                          stream.cursorTo(0)
                          stream.write(
                              `📦  ${chalk.magenta(msg)} ${chalk.magenta(
                                  ~~(percentage * 100) + "%"
                              )}`
                          )
                          stream.clearLine(1)
                      } else if (percentage === 1) {
                          console.log(
                              chalk.green(
                                  "\nwebpack: bundle build is now finished."
                              )
                          )
                      }
                  })
              ]
    ),
    devServer: {
        useLocalIp: true,
        historyApiFallback: true,
        port: PORT,
        hot: true,
        inline: true,
        open: true,
        disableHostCheck: true,
        host: "0.0.0.0",
        openPage: "",
        proxy: {
            "/merchantWalletWeb/h5/*": {
                changeOrigin: true,
                target: "http://mwallettest.tf56pay.com/",
                // target: "http://127.0.0.1:8000/",
                secure: false
            }
        }
    },
    optimization: {
        runtimeChunk: {
            name: "manifest"
        },
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    // 最紧凑的输出
                    beautify: false,
                    // 删除所有的注释
                    comments: false,
                    compress: {
                        // 在UglifyJs删除没有用到的代码时不输出警告
                        warnings: false,
                        // 删除所有的 `console` 语句，可以兼容ie浏览器
                        drop_console: true,
                        // 内嵌定义了但是只用到一次的变量``
                        collapse_vars: true,
                        // 提取出出现多次但是没有定义成变量去引用的静态值
                        reduce_vars: true
                    },
                    dead_code: true
                }
            })
        ],
        splitChunks: {
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: "~",
            name: true,
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: "all",
                    priority: -10,
                    enforce: true
                },
                libs: {
                    test: /(react|HashRouter|MyRedux|fn|prop\-types|react\-dom)/,
                    chunks: "all",
                    priority: 100,
                    enforce: true
                },
                9: {
                    test: /.*/,
                    chunks: "async",
                    minChunks: 9,
                    priority: 99,
                    enforce: true
                },
                5: {
                    test: /.*/,
                    chunks: "async",
                    minChunks: 5,
                    priority: 90,
                    enforce: true
                },
                3: {
                    test: /.*/,
                    chunks: "async",
                    minChunks: 3,
                    priority: 80,
                    enforce: true
                },
                2: {
                    test: /.*/,
                    chunks: "async",
                    minChunks: 2,
                    priority: 70,
                    enforce: true
                },
                // antd: {
                //     test: /antd/,
                //     chunks: "all",
                //     priority: 10,
                //     enforce: true
                // },
                default: false
            }
        }
    },
    devtool: ENV === "production" ? false : "#cheap-module-eval-source-map",
    stats: {
        colors: true
    },
    performance: {
        hints: false
    },
    cache: true
}
