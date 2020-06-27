const withTM = require("next-transpile-modules")();
const webpack = require("webpack");

module.exports = withTM({
  webpack: (config, { dev }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        DEV: dev,
      })
    );

    return config;
  },
});
