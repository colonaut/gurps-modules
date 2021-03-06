'use strict';
module.exports = {
    env: {
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        modules: 'commonjs',
                        debug: false
                    }
                ],
                '@babel/preset-react'
            ],
            plugins: [
                'transform-es2015-modules-commonjs'
            ]
        },
        production: {
            presets: [
                ['@babel/preset-env',
                    {
                        modules: false
                    }
                ],
                '@babel/preset-react'
            ],
            plugins: [
                'transform-es2015-modules-commonjs'
            ]
        },
        development: {
            presets: [
                ['@babel/preset-env',
                    {
                        modules: false
                    }
                ],
                '@babel/preset-react'
            ],
            plugins: [
                'transform-es2015-modules-commonjs'
            ]
        }
    }
};