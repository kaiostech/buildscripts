# kscripts Made with <span style="color: #e25555;">&#9829;</span> to Kaios Team

## React + Typescript

`kscripts` is a bundle of scripts to help us be more productive in day by day tasks.

## The kscripts sit on top of this technology stack
- [Webpack](https://webpack.js.org/) (For generate bundle)
- [Typescript](https://typescrypt.io/)
- [React](https://reactjs.org/) 
- [CSS-modules](https://github.com/css-modules/css-modules)

# Bundle

## Bundle in development mode

`yarn kscripts dev`


## Bundle in production mode

`yarn kscripts prod`


## Create a zipped package in release folder

`yarn kscripts dev --zip` 

`yarn kscripts prod --zip`

# Create a Wiki Report on the project wiki/report link

`yarn kscripts wiki` 

![alt](./docs/checkVersion.png)

# Custom Configs 

We can customize some configurations in webpack inside kscripts.

We can create a object called *kscripts* inside your package

In this current version you can customize the follow parts of webpack.

* Copy Webpack Plugin

This array will be merged inside webpack plugin

* You need to use the same syntax of [Copy Webpack Plugin ](https://github.com/webpack-contrib/copy-webpack-plugin).



```json
// package.json
// To copy in another folder on output folder
"kscripts": {
    "copy-webpack-plugin": [
      {
        "from": "src/service-worker.js", "to":"sw"
      }
    ]
  }

  // To copy in output root
"kscripts": {
    "copy-webpack-plugin": [
      {
        "from": "src/service-worker.js"
      }
    ]
  }

  // A more real example
  "kscripts": {
    "copy-webpack-plugin": [
      {
        "from": "src/service-worker.js"
      },
      {
        "from": "src/resources",
        "to": "resources"
      },
      {
        "from": "src/locales",
        "to": "locales"
      },
      {
        "from": "src/manifest.webapp"
      }
    ]
  }

```


## Build Variables


You can use some build variables to automate or change the behavior of your app

Examples:

 ### To Change a server url 

 ```typescript
// This value will come from webpack bundle mode
const buildEnvironment = process.env.NODE_ENV;
console.log({ buildEnvironment });

// This value will come from --app-env flag in 
// e.g. yarn kscripts dev --app-env cloudStage
const appEnvironment = process.env.APP_ENV;
console.log({ appEnvironment });

 ```