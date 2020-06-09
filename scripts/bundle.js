#!/usr/bin/env node

/**
 * Copyright (c) 2019, Kaios, Inc.
 */

const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ZipFilesPlugin = require('webpack-archive-plugin');
const paths = require('./utils/paths');
const path = require("path");
const fs = require("fs");
const { infoBanner } = require("./utils/display");
const { Spinner } = require('cli-spinner');

//


const webpackConfigCreator = (GlobalConfig) => {


  const appPackage = require(GlobalConfig.paths.appPackageJson);

  // give to developer a chance to choose files to copy
  const devConfig = fs.existsSync(paths.appDevConfig) && require(paths.appDevConfig) || {};

  const devCopyWebpackPlugin = devConfig.copy || [];



  /** -------------------plugins------------------ */

  const appEnv = GlobalConfig.options.app_env ? `${GlobalConfig.options.app_env}` : "";
  const zipOutputRootPath = paths.resolveApp("./release");
  const zipOutputFullPath = `${zipOutputRootPath}/${appPackage.name}__${GlobalConfig.scriptType}_${appPackage.version}_${appEnv}`;
  const zipPlugin = new ZipFilesPlugin({
    entries: [
      {
        src: paths.resolveApp("./dist/"), dist: '../'
      }
    ],
    output: zipOutputFullPath,
    format: "zip"
  });



  const template = {
    // the name of this config, 
    // we can have multiple configs in the future
    name: 'client',

    target: 'web',

    mode: GlobalConfig.scriptType === 'prod' ? 'production' : 'development',

    entry: {
      // Get the entry point for package.main field or the desired src/app.ts
      app: appPackage.main || GlobalConfig.paths.appEntry
    },

    output: {
      filename: '[name].js', // output file
      chunkFilename: '[name].js',
      path: GlobalConfig.paths.appBuildPath
    },

    devtool: GlobalConfig.scriptType === 'prod' ? 'none' : 'source-map',

    resolve: {
      // Add in `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js', ".css", ".json"],
      alias: {
        '@app': GlobalConfig.paths.appSrc
      }
    },

    // optimization: {
    //   splitChunks: {
    //     cacheGroups: {
    //       vendor: {
    //         test: /[\\/]node_modules[\\/].*\.js$/,
    //         name: 'vendors',
    //         chunks: 'all'
    //       }
    //     }
    //   }
    // },

    module: {

      rules: [

        {
          test: /\.js$/,
          include: [/(node_modules)\/(lit-element)/, /(node_modules)\/(lit-html)/],
          use: {
            loader: require.resolve('babel-loader'),
          },
        },

        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: require.resolve('eslint-loader'),
          enforce: 'pre',
        },

        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: require.resolve('ts-loader'),
          options: {
            instance: "app",
            configFile: GlobalConfig.paths.appTsConfig
          },
        },

        { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },

        {
          test: /\.css$/,
          use: [

            { loader: MiniCssExtractPlugin.loader },
            {
              loader: 'typings-for-css-modules-loader',
              options: {
                url: true,
                modules: true,
                namedExport: true,
                localIdentName: "[path]__[name]__[local]__[hash:4]"
              }
            }


          ]
        }
      ],
    },

    plugins: [
      new webpack.EnvironmentPlugin(
        {
          NODE_ENV: process.env.NODE_ENV,
          APP_ENV: GlobalConfig.options.app_env
        }
      ),

      // Copy assets
      new CleanWebpackPlugin([GlobalConfig.paths.appBuildPath], { allowExternal: true, verbose: false }),

      new MiniCssExtractPlugin({ filename: "[name].css", chunkFilename: "[id].css" }),

      new CopyWebpackPlugin(
        [
          ...devCopyWebpackPlugin
        ]
      ),

      new HtmlWebpackPlugin({  // Also generate a test.html        
        template: GlobalConfig.paths.appHtml
      })
    ],

    watch: GlobalConfig.options.watch,

    devServer: {
      host: '0.0.0.0',
      port: 8080,
      inline: false,
      open: true
    }

  };


  // Conditional plugins
  if (GlobalConfig.options.zip) {

    // create directory relase if not exist
    !fs.existsSync(zipOutputRootPath) && fs.mkdirSync(zipOutputRootPath);

    template.plugins.push(zipPlugin);
  }



  return template;

}



async function execute(GlobalConfig) {
  return new Promise((resolve, reject) => {

    try {
      infoBanner(GlobalConfig.scriptType);

      const env = GlobalConfig.scriptType === "prod" ? "production" : "development";

      process.env.BABEL_ENV = env;
      process.env.NODE_ENV = env;


      const webpackConfig = webpackConfigCreator(GlobalConfig);

      if (GlobalConfig.options.server) {
        const spinner = new Spinner('%s Serving your app at http://0.0.0.0:8080...         ')
        spinner.setSpinnerString(18);
        spinner.start();

        const server = new webpackDevServer(webpack(webpackConfig), webpackConfig.devServer);
        server.listen(8080, async (error, stats) => {

          console.log({ error, stats });

        })
      }
      else {
        const spinner = new Spinner('%s building your app...')
        spinner.setSpinnerString(18);
        spinner.start();

        webpack(webpackConfig, async (error, stats) => {

          spinner.stop();

          if (error) {
            console.warn(error.message);
            resolve();
            return;
          }

          const reportString = stats.toString({
            chunks: true,
            children: false,
            modules: false,
            chunkModules: false,
            colors: true,
            built: false
          });

          console.log(reportString);
          // build check size

          resolve();
        });

      }



    } catch (error) {
      // eslint-disable-next-line no-console
      reject(error);
    }
  });
}

module.exports = { execute };
