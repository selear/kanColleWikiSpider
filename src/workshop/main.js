// const toJson = require('./convert2Json');
//
// console.log(toJson);
// console.log(toJson.sample, toJson.example);

// const fetcher = require('./fetchPage');
// const htmlTbl = fetcher.minmizeAfterFetch();

const src = require('./transferModuleSrc');
const dist = require('./transferModuleDist');

dist.set(src.$);
dist.display();