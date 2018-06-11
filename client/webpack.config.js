/* eslint-env node */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// For production build, set this env var to the server public path.
const publicPath = process.env.APP_PUBLIC_PATH || '/';

module.exports = {
  entry: { bundle: './src/index.js' },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../server/public'),
    publicPath,
  },
  devServer: {
    // contentBase: path.join(__dirname, 'build'),
    https: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: process.env.APP_API_DEV_TARGET,
        changeOrigin: true,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?/,
        include: path.resolve(__dirname, 'src/'),
        use: ['babel-loader'],
      },
      {
        // For production, we output a separately cachable stylesheet.
        test: /\.s?css$/,
        use: [
          // Uses style-loader in development to enable hot style replacement (HMR).
          process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          // Uncomment the `modules: true` property to enable css-modules.
          { loader: 'css-loader', options: { importLoaders: 2 , modules: true } },
          'postcss-loader',
          'sass-loader', // Just replace this with less-loader (and install the package) for less.
        ],
      },
      {
        // Any file types which you want to add loaders for should be added to this
        // exclusion list. Otherwise the files will be turned into static links.
        exclude: [
          /\.html$/,
          /\.(m?js|jsx)$/,
          /\.scss$/,
          /\.css$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
        ],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: 'public/index.html',
      title: process.env.APP_BLOG_TITLE || 'Express Blog',
    }),
  ]
};
