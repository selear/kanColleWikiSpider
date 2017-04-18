const fs = require('fs');
const async = require('async');

async.waterfall([
  open,
  doExport  
  ], function(err, result) {
    if(err)
      console.log(err.message);
    else
      console.log(result);
});

function open(callback) {
  console.log('[func]open');
  callback(null, 'this is JSON data');
};

function doExport(json, callback) {
  console.log('[func]doExport', json);
  callback(null, 'export is finished');
};

const EXPORTS = {};
EXPORTS.open = open;
EXPORTS.doExport = doExport;

module.exports = EXPORTS;