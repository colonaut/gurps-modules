'use strict';
module.exports = {
    ...require('../../jest.common.js'),
    name: require('./package.json').name,
    displayName: `specs for "${require('./package.json').name}" package`,
    setupFiles: [
        '../../test/setup.js'
    ],
    testRegex: "\\.(spec)\\.js$"
};