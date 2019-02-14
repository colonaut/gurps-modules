# modules

Mono repo foe custom elements and it's react apps maintained by [lerna](https://github.com/lerna/lerna#about)

##Usage

###To create a new package:
````code
$ npx lerna create Example
````
This will...

````code
$ node .bin/setup --scope Example
````
That will...

````code
$ npx lerna bootstrap --scope Example --hoist
````
Finally will...

###Import an existing package:
[See documentation @lerna](https://github.com/lerna/lerna/tree/master/commands/import#readme)

First clone the repository to your local machine, then:
````code
$ npx lerna import <local path to repositiory>
````
This will...

If wanted, the package can nbe renamed:
````code
node .bin/rename old_name new_name
````
This will rename the folder within the repo, but not package.json.
Run setup and bootstrap like when creating a new package:
````code
$ .bin/setup --scope new_name
$ npx lerna create new_name
$ npx lerna boostrap --scope new_name



