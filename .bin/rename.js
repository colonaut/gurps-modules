//!# /usr/bin/env/node
const fs = require('fs');
const path = require('path');

//workers
const showHelp = () => {
    console.log(`Usage: node .bin/rename old_name new_name
  --help/-h show this help`)
};

const rename = (old_name, new_name) => {
    const old_dir = path.join(__dirname, '../packages', old_name);
    const package_json = require(path.join(old_dir, 'package.json'));
    if (!package_json)
        throw new Error(`No package.json found at ${old_dir}`);

    const new_dir = path.join(__dirname, '../packages', new_name);

    console.log(`-> Renaming "${old_name}" to "${new_name}"`);
    return fs.rename(old_dir, new_dir, function (err) {
        if (err) throw err;

        console.log('Renaming folders complete, run setup and lerna bootsrap!');
    });
};

const [, , ...args] = process.argv;
if (args.length !== 2 || args.indexOf('--help' ) > -1 || args.indexOf('-h') > -1)
    return showHelp();

return rename(args[0], args[1]);