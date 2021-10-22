const path = require('path');

module.exports = {
  entry: { // mapping is from dist/[path] and then source [path]
    'src/inject/inject.js': './src/inject/inject.js',
    'src/options/index.js': './src/options/index.js',
    'src/bg/background.js': './src/bg/background.js',
    'src/inject/inject.css': './src/inject/inject.scss',
    'src/options/index.css': './src/options/index.scss',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, 'extension'),
    filename: '[name]'
  }
};