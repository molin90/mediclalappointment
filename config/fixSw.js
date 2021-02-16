require('babel-register');
require('babel-core/register');
require('idempotent-babel-polyfill');

const fs = require('fs');
const path = require('path');
const constants = require('./constants/constants');

async function findSW(filesNames, distFolder) {
  filesNames.forEach((fileName) => {
    const completePath = `${distFolder}/${fileName}`;
    // console.log(completePath);
    if (
      fileName.indexOf('.js') !== -1
      && fileName.indexOf('.map') === -1
      && fileName.indexOf('.json') === -1
    ) {
      let content = fs.readFileSync(completePath, 'utf-8');
      if (content.indexOf('sw.js')) {
        content = content.replace('sw.js', `https:${constants.BASE_WEBSITE_URL}/sw.js`);
        fs.writeFileSync(completePath, `${content}`);
      }
      // minifyJs(completePath);
    }
  });
}


const distFolder = path.resolve('./dist/assets');
const filesNames = fs.readdirSync(distFolder, 'utf-8');


findSW(filesNames, distFolder);
