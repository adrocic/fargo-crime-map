import { resolve as _resolve, join } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export const entry = "./src/index.tsx";

export const output = {
    filename: "main.js",
    path: _resolve(__dirname, "build"),
};

export const devtool = "source-map"; // Add this line

export const module = {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: "babel-loader",
                    options: {
                        sourceMaps: true, // Enable source maps in babel-loader
                    },
                },
            ],
        },
        {
            test: /\.(ts|tsx)$/,
            use: [
                {
                    loader: "ts-loader",
                    options: {
                        compilerOptions: {
                            sourceMap: true, // Ensure TypeScript generates source maps
                        },
                    },
                },
            ],
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
