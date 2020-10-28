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
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [['@babel/plugin-transform-react-jsx', {pragma: 'createElement'}]]
          }
        }
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
