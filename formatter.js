const fs = require('fs');
const async = require('async');

async.waterfall([
    openFile,
    parseToJson,
    doExport
  ],
  function(err, result) {
    if(err)
      console.log(err);
    else
      console.log(result);
});

const EXPORTS = {};
EXPORTS.openFile    = openFile;
EXPORTS.parseToJson = parseToJson;
EXPORTS.doExport    = doExport;

module.exports = EXPORTS;

function openFile(callback) {
  fs.readFile('./working/kaisyu-table-fixed.json', (err, data) => {
    if(err)
      callback(new Error(err));
    else
      callback(null, data);
  });
}

function parseToJson(fileContent, callback) {

  try {
    let contentInJson = JSON.parse(fileContent);
    callback(null, contentInJson);
  } catch(e) {
    callback(new Error('ERROR by processing JSON.parse()'));
  }
}

function doExport(json, callback) {

  if(json.categories) {
    
    
    callback(null, json.categories[0]);
  }
  else
    callback(new Error('fileContent has NO "categories"'));
}