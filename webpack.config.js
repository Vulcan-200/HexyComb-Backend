const path = require('path');

module.exports = {
  entry: {
    app: './src/client/index.jsx',
    profile: './src/client/profile.jsx',
    client: './public/assets/client.js',
  },
  output: {
    path: path.resolve(__dirname, 'hosted'),
    filename: '[name]Bundle.js',
  },
  mode: 'production',
  module: {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
            },
        },
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  watchOptions: {
    aggregateTimeout: 200,
  },
};