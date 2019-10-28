
const path = require("path")
const {webpackConfig} = require("../config")
const portfinder = require("portfinder")


exports.assetsPath = function(_path){
    if(webpackConfig.isDev){
        _path = _path.replace(".[chunkHash:7]","")
        _path = _path.replace(".[hash:7]","")
    }
    return _path
}

exports.getPort = function(port){
  portfinder.basePort = port
  return portfinder.getPortPromise()
}
