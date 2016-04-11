#!/usr/bin/env node


shell = require('shelljs');

const ignored_branches  = ['master', 'development'];

const current_branch = shell.exec('git rev-parse --abbrev-ref HEAD').output.trim();

const travis_br = process.env.TRAVIS_BRANCH;

console.log("== GIT_BRANCH: ", current_branch);
console.log("== TRAVIS_BRANCH:", travis_br);

if (ignored_branches.indexOf(current_branch) < 0 && ignored_branches.indexOf(travis_br) < 0){
    console.log("== Using 'vizabi@latest'");
    shell.exec("npm i vizabi@latest");
}
