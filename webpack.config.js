】// webpack.config.js
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  // 其他配置
  plugins: [
    new NodePolyfillPlugin()
  ],
  resolve: {
    fallback: {
      fs: require.resolve("browserify-fs"),
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/"),
      zlib: require.resolve("browserify-zlib"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      util: require.resolve("util/"),
      net: false,
      tls: false
    },
  },
};
