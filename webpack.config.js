const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin'); 

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    index: './client/src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    // publicPath: '/build'
  },
  
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /.(css|scss)$/,
        exclude: /node_modules/,
        use: ['style-loader','css-loader'],
      },
      {
        test: /.(css|less)$/,
        include: [
          path.resolve(__dirname, "node_modules/antd"),
      ],
        use: ['style-loader','css-loader','less-loader'],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/public/index.html',
      filename: 'index.html',
      publicPath: process.env.NODE_ENV === 'production' ? 'build' : 'auto',
    })
  ],
  devServer: {
    port: 8080,
    historyApiFallback: true,
    hot: true,
    magicHtml: true,
    proxy: {
      'apiKey':'http://localhost:3000',
      '/auth': 'http://localhost:3000',
      '/reviews': 'http://localhost:3000',
      '/landlords': 'http://localhost:3000',
      '/user': 'http://localhost:3000',
      '/chat': {
        'target':'http://localhost:3001',
        'ws':true
      }
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', 'scss', 'jpg', 'png', 'css','less']
  },
};

