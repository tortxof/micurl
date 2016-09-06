const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: ['babel-polyfill', 'whatwg-fetch', './app/main.js'],
  output: {
    path: path.resolve(__dirname, 'static'),
    publicPath: '/static/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.sass$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(
      {
        "process.env": {NODE_ENV: JSON.stringify(process.env.NODE_ENV)}
      }
    )
  ]
};
