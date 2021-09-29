const path = require("path");
const glob = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// set src directory
const srcDir = "./src";
const entries = glob
  .sync("**/*.js", {
    ignore: "**/_*.js",
    cwd: srcDir,
  })
  .map((key) => {
    return [key, path.resolve(srcDir, key)];
  });
const entryObj = Object.fromEntries(entries);

module.exports = {
  entry: entryObj,
  output: {
    filename: "[name]",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        // 対象となるファイルの拡張子(scss)
        test: /\.scss$/,
        // Sassファイルの読み込みとコンパイル
        use: [
          // CSSファイルを抽出するように MiniCssExtractPlugin のローダーを指定
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // CSSをバンドルするためのローダー
          {
            loader: "css-loader",
            options: {
              //URL の解決を無効に
              url: false,
              sourceMap: false,
            },
          },
          // Sass を CSS へ変換するローダー
          {
            loader: "sass-loader",
            options: {
              // dart-sass を優先
              implementation: require("sass"),
              sassOptions: {
                // fibers を使わない場合は以下で false を指定
                fiber: require("fibers"),
              },
              sourceMap: false,
            },
          },
        ],
      },
    ],
  },
  //プラグインの設定
  plugins: [
    new CleanWebpackPlugin({}),
    new MiniCssExtractPlugin({
      // 抽出する CSS のファイル名
      filename: "[name].css",
    }),
  ],
  //source-map タイプのソースマップを出力
  devtool: "source-map",
  // node_modules を監視（watch）対象から除外
  watchOptions: {
    ignored: /node_modules/, //正規表現で指定
  },
};
