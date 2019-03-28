//!# /usr/bin/env/node
const fs = require('fs');
const path = require('path');

//workers
const packageJson = (pkg_info, callback) => {
    const pkg_file_path = path.join(pkg_info.path, 'package.json');
    const pkg_file = require(pkg_file_path);
    const root_pkg_file = require(path.join(__dirname, './../package.json'));
    const result = [];

    try {
        const devDependencies = {};
        ['cross-env', 'jsdoc-to-markdown', 'jest'].reduce((acc, v) => {
            if (root_pkg_file.devDependencies[v])
                return Object.assign(acc, {
                    [v]: root_pkg_file.devDependencies[v]
                });

        }, devDependencies);

        const scripts = {
            build: "echo \"Error: run build from root\" && exit 1",
            test: "cross-env NODE_ENV=test jest",
            docs: "jsdoc2md src/**/*.js > API.md"
        };

        if (pkg_info.mode === 'app') {
            result.push('app repo, added start script');
            Object.assign(scripts, {
                start: "webpack-dev-server --open --config webpack.dev.js"
            });
        }

        pkg_file.name = pkg_info.name
            .replace(/[A-Z]/, c => c.toLowerCase())
            .replace(/[A-Z]/g, m => "_" + m.toLowerCase());
        pkg_file.scripts = Object.assign(pkg_file.scripts || {}, scripts);
        pkg_file.devDependencies = Object.assign(pkg_file.devDependencies || {}, devDependencies);
        pkg_file.license = 'MIT';
        //pkg_file_data = JSON.stringify(pkg, null, 2);

        result.push(`package name: ${pkg_file.name}`)
        result.push(`added devDependencies: ${Object.keys(pkg_file.devDependencies)}`);
        result.push(`added scripts: ${Object.keys(pkg_file.scripts)}`);

    } catch (err) {
        return callback(err);
    }

    fs.writeFile(pkg_file_path, JSON.stringify(pkg_file, null, 2), (err) => {
        if (err)
            callback(err);

        return callback(null, result.length ? result : true);
    });

};
const babelConfig = (dir, callback) => {
    const file_path = path.join(dir, 'babel.config.js')
    const file_content = `'use strict';
module.exports = {
    ...require('../../babel.config.js')
};`;

    const result = [], errors = [];
    return fs.writeFile(file_path, file_content, {flag: 'wx'}, (err) => {
        if (err && err.code === 'EEXIST')
            result.push('babel.config.js already exists');

        else if (err)
            errors.push(err);

        if (errors.length)
            return callback(errors);

        return callback(null, result.length ? result : true);
    });
};
const jestConfig = (dir, callback) => {
    const file_path = path.join(dir, 'jest.config.js')
    const file_content = `'use strict';
module.exports = {
    ...require('../../jest.common.js'),
    name: require('./package.json').name,
    displayName: \`specs for "\${require('./package.json').name}" package\`,
    setupFiles: [
        '../../test/setup.js'
    ],
    testRegex: "\\\\.(spec)\\\\.js$"
};`;
    const result = [], errors = [];
    return fs.writeFile(file_path, file_content, {flag: 'wx'}, (err) => {
        if (err && err.code === 'EEXIST')
            result.push('index.js already exists');

        else if (err)
            errors.push(err);

        if (errors.length)
            return callback(errors);

        return callback(null, result.length ? result : true);
    });
};
const webpackConfig = (pkg_info, callback) => {
    if (pkg_info.type !== 'app')
        return callback('not an app repo, no webpack config added');



    const webpack_common_data = `const path = require('path');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
       {
        test: /\\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test:/\\.css$/,
        use:['style-loader','css-loader']
      }
    ]
  }
};`;

    const webpack_dev_data = `const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: [path.join(__dirname, 'public')],
    compress: true,
    port: 9002
  }
});`;

    const webpack_prod_data = `const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production'
});`;

    const pulic_index_data = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>${pkg_info.path}</title>
</head>

<body>
  <h1>${pkg_info.path}</h1>
  <div id="app-dev">Placeholder before app.</div>
  <script src="./bundle.js"></script>
</body>
</html>`;

    const result = [];
    const errors = [];

    return fs.mkdir(pkg_info.path, (err) => {
        if (err && err.code === 'EEXIST')
            result.push('src directory already exists');
        else if (err)
            errors.push(err);

        fs.mkdir(path.join(pkg_info.path, 'public'), (err) => {
            if (err && err.code === 'EEXIST')
                result.push('src directory already exists');
            else if (err)
                errors.push(err);

            fs.writeFile(path.join(pkg_info.path, 'public', 'index.html'), pulic_index_data, {flag: 'wx'}, (err) => {
                if (err && err.code === 'EEXIST')
                    result.push('webpack.common.js already exists');
                else if (err)
                    errors.push(err);
            });
        });

        fs.writeFile(path.join(pkg_info.path, 'webpack.common.js'), webpack_common_data, {flag: 'wx'}, (err) => {
            if (err && err.code === 'EEXIST')
                result.push('webpack.common.js already exists');
            else if (err)
                errors.push(err);

            fs.writeFile(path.join(pkg_info.path, 'webpack.dev.js'), webpack_dev_data, {flag: 'wx'}, (err) => {
                if (err && err.code === 'EEXIST')
                    result.push('webpack.dev.js already exists');
                else if (err)
                    errors.push(err);

                fs.writeFile(path.join(pkg_info.path, 'webpack.prod.js'), webpack_prod_data, {flag: 'wx'}, (err) => {
                    if (err && err.code === 'EEXIST')
                        result.push('webpack.prod.js already exists');
                    else if (err)
                        errors.push(err);

                    if (errors.length)
                        return callback(errors);

                    return callback(null, result.length ? result : true);
                });
            });

        });
    });
};
const structureSetup = (dir, package_name, callback) => {
    const src_file_path = path.join(dir, 'src');

    const index_data = `'use strict';

export default () => 'Hello Example World!';
`;

    const index_spec_data = `'use strict';
import {default as alive} from './index';

describe('NO TESTS HERE!', () => {
    it('should be tested!', () => {
        expect(alive()).toEqual('Hello Example World!');
    });
});
`;

    const result = [];
    const errors = [];

    return fs.mkdir(src_file_path, (err) => {
        if (err && err.code === 'EEXIST')
            result.push('src directory already exists');
        else if (err)
            errors.push(err);

        fs.writeFile(path.join(src_file_path, 'index.js'), index_data, {flag: 'wx'}, (err) => {
            if (err && err.code === 'EEXIST')
                result.push('index.js already exists');
            else if (err)
                errors.push(err);

            fs.writeFile(path.join(src_file_path, 'index.spec.js'), index_spec_data, {flag: 'wx'}, (err) => {
                if (err && err.code === 'EEXIST')
                    result.push('index.spec.js already exists');
                else if (err)
                    errors.push(err);


                if (errors.length)
                    return callback(errors);

                return callback(null, result.length ? result : true);
            });
        });
    });

};

const showHelp = () => {
    console.log(`Usage: node bin/setup.js [path_to_package [, path_to_package, ...]]
  --help/--h show this help
  --grace/--g gracefully preserve existing
  --force/--f force overwrite (default)`);
};

//analyze command
const argv = require('yargs').argv;
if (argv.h || argv.help)
    return showHelp();

return fs.readdir(path.join(__dirname, '../packages'), 'utf8', (err, packages_contents) => {
    if (err)
        return console.log(err);

    packages_contents.filter((package_name) => {
        return argv._.length === 0 || argv._.indexOf(package_name) > -1;
    }).map((package_name) => {
        const dir_path = path.join(__dirname, '../packages', package_name);
        if (fs.lstatSync(dir_path).isDirectory())
            return {
                name: package_name,
                path: dir_path,
                type: ['app', 'module', 'utils'].find(v => package_name.toLocaleLowerCase().endsWith(v)) || 'unknown'
            }
    }).forEach((pkg_info) => {
        console.log(`Setup [${(pkg_info.type).toUpperCase()}] "${pkg_info.name}" in "${pkg_info.path}"`);

        babelConfig(pkg_info.path, (err, res) => {
            console.log(pkg_info.name, '-> add babel.config.js');
            if (err)
                console.error(err);

            return console.log(res);
        });
        jestConfig(pkg_info.path, (err, res) => {
            console.log(pkg_info.name, '-> add jest.config.js');
            if (err)
                console.error(err);

            return console.log(res);
        });
        structureSetup(pkg_info.path, pkg_info.name, (err, res) => {
            console.log(pkg_info.name, '-> package structure setup');
            if (err)
                console.error(err);

            return console.log(res);
        });
        webpackConfig(pkg_info, (err, res) => {
            console.log(pkg_info.name, '-> webpack config');
            if (err)
                console.error(err);

            return console.log(res);
        });
        packageJson(pkg_info, (err, res) => {
            console.log(pkg_info.name, '-> update package.json');
            if (err)
                console.error(err);

            return console.log(res);
        });
    });

});
