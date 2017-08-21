const helpers = require('./config/helpers');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  devtool: '#source-map',

  resolve: {
    extensions: ['.ts', '.js']
  },

  entry: helpers.root('index.ts'),

  output: {
    path: helpers.root('bundles'),
    publicPath: '/',
    filename: 'http-loader.umd.js',
    libraryTarget: 'umd',
    library: 'localize-router-http-loader'
  },

  // require those dependencies but don't bundle them
  externals: [/^\@angular\//, /^rxjs\//, /^\@ngx-translate\//, /^localize-router\//],
  target: 'node',

  module: {
    rules: [{
      enforce: 'pre',
      test: /\.ts$/,
      loader: 'tslint-loader',
      exclude: [helpers.root('node_modules')]
    }, {
      test: /\.ts$/,
      loader: 'awesome-typescript-loader?declaration=false'
    }]
  },

  plugins: [
    // fix the warning in ./~/@angular/core/src/linker/system_js_ng_module_factory_loader.js
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('./src')
    ),

    new webpack.LoaderOptionsPlugin({
      options: {
        tslintLoader: {
          emitErrors: false,
          failOnHint: true
        }
      }
    }),

    new CleanWebpackPlugin(['bundles'], {
      root: helpers.root(),
      verbose: false,
      dry: false
    })
  ]
};
