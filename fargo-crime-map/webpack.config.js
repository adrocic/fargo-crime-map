import { resolve as _resolve, join } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export const entry = "./src/index.tsx";
export const output = {
  filename: "main.js",
  path: _resolve(__dirname, "build"),
};
export const module = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ["babel-loader"],
    },
    {
      test: /\.(ts|tsx)$/,
      loader: "ts-loader",
    },
  ],
};
export const resolve = {
  extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
};
export const plugins = [
  new HtmlWebpackPlugin({
    template: join(__dirname, "public", "index.html"),
  }),
];
export const devServer = {
  static: {
    directory: join(__dirname, "build"),
  },
  port: 3000,
};
