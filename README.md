# p5-delaunay

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-98.76%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-91.66%25-brightgreen.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-98.73%25-brightgreen.svg?style=flat) |

## Introduction
* A Typescript + [p5.js](https://github.com/processing/p5.js) port of [Incremental Delaunay Triangulation what was built with processing.js](https://github.com/whyi/Delaunay)
* Live demo: https://www.whyi.net/

## How to
* Prerequisite: Clone the repository then run ```npm install```.
* Please refer to the following table to build, test, and run.

| Command                   | Description                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| ```npm run start```       | Start a local webserver in watch mode.                                                          |
| ```npm run build```       | Build the project and output to the ```dist``` directory.                                       |
| ```npm tsc```             | run ```tsc``` to compile all typescripts and place .js files to the ```dist``` directory.       |
| ```npm watch```           | run ```tsc``` in watch mode, recommend pair it with the command ```npm run test:watch``` below. |
| ```npm run test```        | Run all tests under the ```__tests__``` directory.                                             |
| ```npm run test:watch```  | Run all tests under the ```__tests__``` directory in watch mode.                               |
| ```npm run make-badges``` | Update badges from the jest code coverage report.                                               |

## Issues
* Please use the [Issues](https://github.com/whyi/p5-delaunay/issues) tab to report bugs and suggestions.

## Dependencies
* All build dependencies are up-to-date versions as of ```Nov 15 2023```.
* Runtime dependency: the latest version of [p5.js](https://github.com/processing/p5.js)
