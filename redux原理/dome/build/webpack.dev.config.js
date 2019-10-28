const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config');
const { webpackConfig } = require('../config');
const util = require('./util');

let devserverPort = process.env.PORT || webpackConfig.devserverPort;

const config = merge(webpackBaseConfig, {
  mode: 'development',
  devServer: {
    hot: true,
    inline: true,
    useLocalIp: true,
    historyApiFallback: true,
    disableHostCheck: true,
    stats: 'errors-only',
    host: '0.0.0.0',
    proxy: webpackConfig.devserverProxy,
  },
});

module.exports = new Promise((resolve, reject) => {
  util.getPort(devserverPort).then((port) => {
    devserverPort = port;
    resolve(config);
  });
});
