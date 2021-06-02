const { merge } = require('webpack-merge')
const webpack = require('webpack')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { proxySetting } = require('../proxy')
const common = require('./webpack.common')
const { SERVER_HOST, SERVER_PORT } = require('../constants')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: SERVER_HOST,
    port: SERVER_PORT,
    clientLogLevel: 'silent', // 日志等级
    compress: true, // 是否启用 gzip 压缩
    open: true, // 打开默认浏览器
    hot: true, // 热更新
    proxy: {
      ...proxySetting,
    },
  },
  plugins: [new ReactRefreshPlugin(), new webpack.HotModuleReplacementPlugin()],
  target: 'web', // 必须设置，这样才会自动刷新
})
