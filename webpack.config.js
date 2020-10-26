const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
module.exports = {
  entry: path.join(__dirname, 'src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HTMLPlugin()
  ],
  mode: 'development',
  devServer: {
    port: 9000,
    compress: true
  },
  optimization: {
    minimize: false
  }
}
