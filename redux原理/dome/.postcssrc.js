const { webpackConfig } = require("./config")

module.exports = {
    ident: "postcss",
    sourceMap: webpackConfig.isDev,
    plugins: [require("autoprefixer")]
}
