#!/usr/bin/env node

/**
 * Copyright (c) 2019-present, Kaios, Inc.
 */

const prompt = require("prompt");
const { errorBanner, successLog, errorLog, errorLine, infoLog } = require("../scripts/utils/display");
const paths = require("../scripts/utils/paths");
const fs = require("fs");
const DateFormat = require("../scripts/utils/dateformat");


// Scripts
const BundleScript = require("../scripts/bundle");
//-----------------------

const allcommands = [...process.argv];
const scriptType = allcommands.splice(2, 1)[0];
const scriptArgs = allcommands.splice(2);

const GlobalConfig = {
  scriptType: scriptType,
  scriptArgs: scriptArgs,
  date: DateFormat.yyyymmddhhmmss(new Date()),
  devConfig: fs.existsSync(paths.appDevConfig) && require(paths.appDevConfig) || {},
  options: {
    app_env: scriptArgs.includes("--app-env")
      ? scriptArgs[scriptArgs.indexOf("--app-env") + 1]
      : null,
    zip: scriptArgs.includes("--zip"),
    showConfigs: scriptArgs.includes("--showConfigs"),
    ads: scriptArgs.includes("--ads"),
    ci: scriptArgs.includes("--ci"),
    updateCheck: scriptArgs.includes("--updateCheck"),
    // Pass watch mode to webpack
    // if [ci] is present, watch SHOULD be false (forced)
    watch: scriptArgs.includes("--ci") ? false : scriptArgs.includes("--watch"),
    // Set the test to show coverage
    coverage: scriptArgs.includes("--coverage"),

    // server the app on browser?
    server: scriptArgs.includes("--server"),
  },
  ads: {
    vendorName: scriptArgs.includes("--ads")
      ? scriptArgs[scriptArgs.indexOf("--ads") + 1]
      : "no_ads"
  },
  web: {
    port: scriptArgs.includes("--web-port")
      ? scriptArgs[scriptArgs.indexOf("--web-port") + 1]
      : 3000
  },
  paths
};


// Validate Development Environment
function validate() {

  // tasks to validate
  const tasks = [];

  // Testing environment
  const indexHtmlExist = fs.existsSync(paths.appHtml);
  const packageExist = fs.existsSync(paths.appPackageJson);

  // Validate Manifest Version
  const manifestExist = fs.existsSync(paths.appManifest);

  const validateManifestVersions = () => {
    if (manifestExist) {

      const manifest = fs.readFileSync(paths.appManifest).toString("utf8");
      const appManifest = JSON.parse(manifest);
      const appPackage = require(paths.appPackageJson);
      return appManifest.version !== undefined &&
        appManifest.version !== "" &&
        appManifest.version === appPackage.version;
    }
    return false;
  }
  // validate ManifestCategories
  const allowedManifestCategories = [
    "social",
    "games",
    "utilities",
    "lifestyle",
    "news",
    "shopping",
    "entertainment",
    "health",
    "sports",
    "book & reference"
  ];
  const validateManifestCategories = () => {
    if (manifestExist) {
      const manifest = fs.readFileSync(paths.appManifest).toString("utf8");
      const appManifest = JSON.parse(manifest);

      return Array.isArray(appManifest.categories) &&
        appManifest.categories.every(c => allowedManifestCategories.indexOf(c) !== -1)
    }
    return false;
  };

  const validateManifestDeveloper = () => {
    if (manifestExist) {
      const manifest = fs.readFileSync(paths.appManifest).toString("utf8");
      const appManifest = JSON.parse(manifest);
      return appManifest.developer && appManifest.developer.name === "KaiOS"

    }
    return false;
  };

  // Manifest

  // run testes
  tasks.push({
    name: "Index html exist?",
    result: indexHtmlExist,
    errorMsg:
      "Could not find your index.html, your index.html must be in src/index.html"
  });

  tasks.push({
    name: "Package exist?",
    result: packageExist,
    errorMsg:
      "Could not find your package.json. Did you missed your package.json file?"
  });

  // Manifest Tasks
  tasks.push({
    name: "Manifest exist?",
    result: manifestExist,
    errorMsg: `Manifest not found in ${paths.appManifest}`
  });


  tasks.push({
    name: "Manifest version?",
    result: validateManifestVersions(),
    errorMsg: `Manifest.version can not be empty and should be synced with your Package.version`
  });

  // Store requested to insert this validation
  // only provided categories should be used
  tasks.push({
    name: "Manifest categories?",
    result: validateManifestCategories(),
    errorMsg: `Manifest.categories must be one of the following values ${allowedManifestCategories}`
  });

  // Store requested to use a hardcoded 'KaiOS' value
  tasks.push({
    name: "Manifest Developer name!",
    result: validateManifestDeveloper(),
    errorMsg: `Manifest.developer.name should be 'KaiOS'`
  });

  //--------------------------------------

  const isPassed = tasks.map(t => t.result).every(t => t);

  if (!isPassed) {
    errorBanner("Validation Error");

    tasks.forEach(task => {
      if (task.result) {
        successLog(`${task.name} OK`);
      } else {
        errorLog(`${task.name} ERROR`);
        errorLog(`--- ${task.errorMsg}\n`);
      }
    });
    errorLine();
    process.exit();
  }
}


if (GlobalConfig.scriptType !== "wiki")
  validate();

async function execute() {
  switch (GlobalConfig.scriptType) {
    case "prod":
    case "dev":
      await BundleScript.execute(GlobalConfig);
      break;

    case "release":
      Release.execute(GlobalConfig);
      break;

    case "release-embedded":
      ReleaseEmbedded.execute(GlobalConfig);
      break;

    default:
      console.log(`Unknown script ${scriptType}`);
      console.log("Perhaps you need to update kaios-scripts?");
      console.log("See: https://git.kaiostech.com/itriad/kscripts");
      break;
  }
}

execute();
