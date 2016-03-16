#!/usr/bin/env node


shell = require('shelljs');

const ignored_branches  = ['master', 'development'];

const current_branch = shell.exec('git rev-parse --abbrev-ref HEAD').output.trim();


if (ignored_branches.indexOf(current_branch) < 0){
    console.log("== Using 'vizabi@latest'");
    shell.exec("npm i vizabi@latest");
}
