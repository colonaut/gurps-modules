//!# /usr/bin/env/node
const fs = require('fs');
const path = require('path');

//analyze command
const available_repo_packages = fs.readdirSync(path.join(__dirname, '../packages'), 'utf8')
    .filter((name) => fs.lstatSync(path.join(__dirname, '../packages', name)).isDirectory());
const [, , ...args] = process.argv;
const scope = [], flags = [], unknown = [];
let is_scope = false;
for (let i = 0; i < args.length; i++) {

    if (args[i] === '--help' || args[i] === '-h')
        return showHelp();

    if (args[i] === '--scope') {
        is_scope = true;
        continue;
    }

    if (args[i].startsWith('-')) {
        flags.push(args[i]);
        is_scope = false;
        continue;
    }

    if (is_scope) {
        scope.push(args[i]);
        continue;
    }

    unknown.push(args[i])
}


//workers
const showHelp = () => {
    console.log(`Usage: node .bin/setup.js
  --help/-h show this help
  --scope define the packages to setup
  -g gracefully preserve existing
  -f force overwrite (default)`);
};
const packageJson = (dir, package_name, callback) => {
    const pkg_file_path = path.join(dir, 'package.json');
    const pkg = require(pkg_file_path);
    let pkg_file_data = JSON.stringify(pkg);
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
        pkg_file_data = JSON.stringify(pkg, null, 2);
    } catch (err) {
        return callback(err);
    }

    fs.writeFile(pkg_file_path, pkg_file_data, (err) => {
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

//wrong flags
if (unknown.length) {
    console.error(`Unknown flag "${unknown[0]}"`);
    return showHelp();
}


//check command
let work_packages = [].concat(scope);
if (scope.length === 0)
    work_packages = [].concat(available_repo_packages);

console.log(`Bootstrapping ${work_packages.length} Packages:`, work_packages);

work_packages.forEach((package_name, index) => {
    const dir = path.join(__dirname, '../packages', package_name);
    //console.log('-> work dir:', dir);
    if (available_repo_packages.indexOf(package_name) === -1)
        return console.error(package_name, 'Error:', 'package does not exist\n');

    babelConfig(dir, (err, res) => {
        console.log(package_name, '-> add babel.config.js');
        if (err)
            console.error(err);

        return console.log(res);
    });

    jestConfig(dir, (err, res) => {
        console.log(package_name, '-> add jest.config.js');
        if (err)
            console.error(err);

        return console.log(res);
    });

    structureSetup(dir, package_name, (err, res) => {
        console.log(package_name, '-> test setup');
        if (err)
            console.error(err);

        return console.log(res);
    });

    packageJson(dir, package_name, (err, res) => {
        console.log(package_name, '-> update package.json');
        if (err)
            console.error(err);

        return console.log(res);
    });
});

//TODO: webpack stuff when --app and stuff


