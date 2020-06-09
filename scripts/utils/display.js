/**
 * Copyright (c) 2018-present, Kaios, Inc.
 */

const chalk = require("chalk");
const chalkLine = require("chalkline");

const banner = (msg) =>
  `.,.  .,. 
.,,  .,, 
.,,.,,   \t${msg}
.,, .,,. 
.,,   ,,.
`;

const successMessage = message => chalk.green(message);
const warningMessage = message => chalk.yellow(message);
const infoMessage = message => chalk.magenta(message);
const errorMessage = message => chalk.red(message);

const successLog = message => console.log(successMessage(message));
const warningLog = message => console.log(warningMessage(message));
const errorLog = message => console.log(errorMessage(message));
const infoLog = message => console.log(infoMessage(message));

const successBanner = msg => console.log(successMessage(banner(msg || "SUCCESS")));
const warningBanner = msg => console.log(warningMessage(banner(msg || "WARNING")));
const errorBanner = msg => console.log(errorMessage(banner(msg || "ERROR")));
const infoBanner = msg => console.log(infoMessage(banner(msg || "INFO")));

const errorLine = () => chalkLine.red();
const warningLine = () => chalkLine.yellow();
const successLine = () => chalkLine.green();


module.exports = {
  successMessage,
  warningMessage,
  errorMessage,
  infoMessage,

  successLog,
  warningLog,
  errorLog,
  infoLog,

  errorLine,
  warningLine,
  successLine,

  warningBanner,
  errorBanner,
  successBanner,
  infoBanner
};
