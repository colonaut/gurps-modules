//!# /usr/bin/env/node
const fs = require('fs');
const path = require('path');

//workers
const packageJson = (package_path, package_name, callback) => {
    const pkg_file_path = path.join(package_path, 'package.json');
    const pkg = require(pkg_file_path);
    //let pkg_file_data = JSON.stringify(pkg);
    try {
        const devDependencies = {
            "cross-env": "^5.2.0",
            "jsdoc-to-markdown": "^4.0.1",
            "jest": "^23.6.0"
        };
        const scripts = {
            build: "echo \"Error: run build from root\" && exit 1",
            test: "cross-env NODE_ENV=test jest",
            docs: "jsdoc2md src/**/*.js > API.md"
        };
        pkg.name = package_name
            .replace(/[A-Z]/, c => c.toLowerCase())
            .replace(/[A-Z]/g, m => "-" + m.toLowerCase());
        pkg.scripts = Object.assign(pkg.scripts || {}, scripts);
        pkg.devDependencies = Object.assign(pkg.devDependencies || {}, devDependencies);
        pkg.license = 'MIT';
        //pkg_file_data = JSON.stringify(pkg, null, 2);
    } catch (err) {
        return callback(err);
    }

    fs.writeFile(pkg_file_path, JSON.stringify(pkg, null, 2), (err) => {
        if (err)
            callback(err);

        callback(null, true);
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
                path: dir_path
            }
    }).forEach((pkg) => {
        console.log(`Setup "${pkg.name}" in "${pkg.path}"`);

        babelConfig(pkg.path, (err, res) => {
            console.log(pkg.path, '-> add babel.config.js');
            if (err)
                console.error(err);

            return console.log(res);
        });
        jestConfig(pkg.path, (err, res) => {
            console.log(pkg.path, '-> add jest.config.js');
            if (err)
                console.error(err);

            return console.log(res);
        });
        structureSetup(pkg.path, pkg.name, (err, res) => {
            console.log(pkg.path, '-> test setup');
            if (err)
                console.error(err);

            return console.log(res);
        });
        packageJson(pkg.path, pkg.name, (err, res) => {
            console.log(pkg.path, '-> update package.json');
            if (err)
                console.error(err);

            return console.log(res);
        });
    });
});
