let timeout = 5000;
if (process.env.MOCHA_TIMEOUT) {
  timeout = MOCHA_TIMEOUT;
}

const config = {
  "bail": true,
  "enable-source-maps": true,
  "extensions": ["ts"],
  "recursive": true,
  "require": ["ts-node/register", "./test/testSetup.ts"],
  "throw-deprecation": true,
  "timeout": timeout,
}

if (process.env.MOCHA_THROW_DEPRECATION === 'false') {
  delete config['throw-deprecation'];
}
if (process.env.MOCHA_REPORTER) {
  config.reporter = process.env.MOCHA_REPORTER;
}
if (process.env.MOCHA_REPORTER_OUTPUT) {
  config['reporter-option'] = `output=${process.env.MOCHA_REPORTER_OUTPUT}`;
}
module.exports = config