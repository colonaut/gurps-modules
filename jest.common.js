module.exports = {
    /*roots: [
        'packages/',
    ],*/
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        '**/{src|lib}/**/*.{js|jsx}',
        '!**/node_modules/**',
    ],
    //"testURL": "http://localhost:9001",
    clearMocks: true,
    "moduleFileExtensions": [
        "jsx",
        "js"
    ],
    transform: {
        "^.+\\.js$": "babel-jest"
    },
    transformIgnorePatterns: [
        "/node_modules/",
        "/lib/"
    ],
    testEnvironment: "jest-environment-jsdom-thirteen",
    testPathIgnorePatterns: [
        "/node_modules/",
        "/lib/"
    ]
};
