const path = require("path");
const { version } = require("../package.json");

const config = {
    dev: {
        isDev: true,
        assetsPublicPath: "",
        devserverPort: 8080,
        devserverProcess: {},
        devserverProxy: {
        },
        autoOpenBrower: false,
        devtool: "cheap-module-eval-source-map"
    },
    build: {
        isDev: false,
        buildPath: path.resolve(__dirname, "../dist"),
        assetsPublicPath: "./",
        productionSourceMap: true,
        
        devtool: false
    }
};

module.exports = process.env.NODE_ENV === "production" ? config.build : config.dev;
