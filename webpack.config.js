const { DefinePlugin, HotModuleReplacementPlugin } = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const publicPath = path.join(__dirname, "public");
const projectPath = __dirname;

const config = {
    mode: "development",
    context: __dirname,
    entry: {
        app: "./client/index.js",
    },
    output: {
        path: publicPath,
        filename: "bundle.js",
        publicPath: "/",
    },
    resolve: {
        modules: ["node_modules", "client"],
        extensions: [".js", ".jsx"],
    },
    devtool: "cheap-module-eval-source-map",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "assets",
                        },
                    },
                ],
            },
            {
                test: require.resolve("webrtc-adapter"),
                use: "expose-loader",
            },
        ],
    },
    plugins: [
        new DefinePlugin({
            SOCKET_HOST: JSON.stringify("localhost:3000"),
        }),
        new HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: "Near video",
            template: "public/index.html",
        }),
    ],
    devServer: {
        compress: true,
        port: 9000,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
        },
        historyApiFallback: true,
    },
};

module.exports = config;
