var path = require('path');
// var webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const isProduction = (process.env.NODE_ENV === 'production');

module.exports = {
  mode: (isProduction) ? "production" : "development",
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: (isProduction) ? 'example-form.wc.min.js' : 'example-form.wc.js',
    library: "ExampleForm",
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      { // loads our .vue files
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      { // compiles our typescript files into javascript
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      { // we use the url-loader so that any urls that point to static assets get loaded as a base64 uri
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {}
      },
      { // load our css and inject it into the dom using the style-loader
        test: /\.css$/,
        use: [
          {
            loader: "style-loader" // Adds CSS to the DOM by injecting a <style> tag
          },{
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              sourceMap: (isProduction) ? false : true
            }
          }
        ]
      },
      { // load our scss files, much the same way as our css files
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // Adds CSS to the DOM by injecting a <style> tag
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              sourceMap: (isProduction) ? false : true
            }
          }, 
          {
            loader: "sass-loader", // compiles Sass to CSS
            options: {
              sourceMap: (isProduction) ? false : true,
              includePaths: ['./node_modules']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json']
  },
  externals: {
    vue: {
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
      root: 'Vue'
    }
  }
}

if(!isProduction) {
  module.exports.devtool = "#source-map";
}