const http = require('http');
const fs = require('fs');
const tmp = require('tmp');

module.exports = {
  get: (url) => {
    return new Promise(function (resolve, reject){
      const tmpFile = tmp.fileSync({ prefix: 'bisaac-', postfix: '.png' });

      const file = fs.createWriteStream(tmpFile.name);
      http.get(url, (response) => {
        response.pipe(file);
        resolve(tmpFile.name);
      });
    });
  }
};