var path = require('path');
var webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[contenthash][name].css",
    disable: process.env.NODE_ENV === "development"
});

const plugins = {
  production: [
    new webpack.optimize.UglifyJsPlugin({
      compress: true
    }),
    new webpack.EnvironmentPlugin('NODE_ENV')
    /*extractSass,*/
  ],
  development: [
    new webpack.optimize.UglifyJsPlugin({
      compress: true
    })
  ]
}

module.exports = {
  context: __dirname + "/src",
  entry: {
    app: './main.jsx'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      app: path.resolve(__dirname, 'src/'),
      controllers: path.resolve(__dirname, 'src/controllers/'),
      components: path.resolve(__dirname, 'src/components/'),
      utility: path.resolve(__dirname, 'src/utility/'),
      constants: path.resolve(__dirname, 'src/constants/')
    }
  },
  module: {
    rules: [
      {
        test: /\.eot$|\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$|\.txt$/,
        loader: "file-loader?name=[path][name].[ext]"
      },
      {
        test:  /\.(js|jsx)$/,
        exclude: ['node_modules', 'data'],
        loader: 'babel-loader',
        query: {
          presets: [
            ['es2015', {"modules": false}],
            'react'
          ],
          plugins: [require('babel-plugin-transform-object-rest-spread')]
        }
      },
      {
        test: /\.(css|scss)$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
/*      {
        test: /\.(css|scss)$/,
        loader: extractSass.extract({
          use: [
          {
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          }],
          fallback: "style-loader"
        })
      },*/
      {
        test: /\.html$/,
        loader: 'file-loader?name=[name].[ext]!extract-loader!html-loader'
      }
    ]
  },

  devServer: {
    contentBase: path.join(__dirname, "src"),
    port: 9000
  },
  devtool: "source-map"
}