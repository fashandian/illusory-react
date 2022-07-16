/*
 * @Date: 2021-06-05 17:50:27
 * @LastEditors: fashandian
 * @LastEditTime: 2021-06-05 19:31:39
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    optimization: {
        minimize: false,
    },
    entry: {
        main: path.join(__dirname, './index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // 增加代码转换
                        presets: ['@babel/preset-env'],
                        plugins: [
                            // jsx转换
                            [
                                '@babel/plugin-transform-react-jsx',
                                // <div />  => createElement('div', null)
                                { pragma: 'createElement' },
                            ],
                        ],
                    },
                },
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'illusory-react',
        }),
    ],
};
