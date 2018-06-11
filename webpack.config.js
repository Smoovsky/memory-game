const HtmlWebpackPlugin = require('html-webpack-plugin'); // Require  html-webpack-plugin plugin
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();
const DashboardPlugin = require('webpack-dashboard/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const ENV = process.env.APP_ENV;
const isTest = ENV === 'test';
const isProd = ENV === 'prod';
// console.log(ENV);

function setDevTool() {  // function to set dev-tool depending on environment
  if (isTest) {
    return 'inline-source-map';
  } else if (isProd) {
    return 'source-map';
  } else {
    return 'eval-source-map';
  }
}

const config = {
  entry: __dirname + '/src/app/index.js', // webpack entry point. Module to start building dependency graph
  output: {
    path: __dirname + '/dist', // Folder to store generated bundle
    filename: 'bundle.js',  // Name of generated bundle after build
    publicPath: './' // public URL of the output directory when referenced in a browser
  },
  mode:'development',
  module: {  // where we defined file patterns and their loaders
    rules: [
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
            publicPath: './fonts/'
          }
        }]
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'sass-loader' // compiles Sass to CSS
        }]
      },
    ]
  },
  plugins: [  // Array of plugins to apply to build chunk
    new HtmlWebpackPlugin({
      template: __dirname + '/src/public/index.html',
      inject: 'body'
    }),
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({  // plugin to define global constants
      API_KEY: JSON.stringify(process.env.API_KEY)
    }),
    new DashboardPlugin(),
  ],
  devServer: {  // configuration for webpack-dev-server
    contentBase: './src/public',  //source of static assets
    port: 7700, // port to run dev-server
  },
  devtool: setDevTool(),
};

if(isProd) {  // plugins to use in a production environment
  config.plugins.push(
    new UglifyJSPlugin(),  // minify the chunk
    new CopyWebpackPlugin([{  // copy assets to public folder
      from: __dirname + '/src/public'
    }])
  );
}

module.exports = config;
