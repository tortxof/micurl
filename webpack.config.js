var path = require('path');
module.exports = {
  entry: {
    app: ['./app/main.js']
  },
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
  }
};
