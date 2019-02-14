const common = require('./jest.common.js');
module.exports = {
    ...common,
    //projects: [
      //  '<rootDir>/packages/*/jest.config.js'
    //],
    //coverageDirectory: '<rootDir>/coverage/',
    setupFiles: [
        './test/setup.js'
    ],
    testRegex: "\\.(spec)\\.js$",
};