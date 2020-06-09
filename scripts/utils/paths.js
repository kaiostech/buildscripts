const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = relativePath => path.resolve(appDirectory, relativePath);



// config before eject: we're in ./node_modules/react-scripts/config/
module.exports = {
  appEntry: resolveApp("src/app.ts"),
  appPath: resolveApp("."),
  appBuildPath: resolveApp("dist"),
  appDevConfig: resolveApp("kscripts.config.json"),
  appDist: resolveApp("dist"),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("src/index.html"),
  appPackageJson: resolveApp("package.json"),
  appManifest: resolveApp("src/manifest.webapp"),
  appTsConfig: resolveApp("tsconfig.json"),
  appSrc: resolveApp("src"),
  appResources: resolveApp("src/resources"),
  appLocales: resolveApp("src/locales"),
  appReleaseNotes: resolveApp("RELEASE_NOTES.md"),
  resolveApp
};
