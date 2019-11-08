const fetcher = require('./FetchPage');
const extractor = require('./DataAnalyst');

let fetchPagePromise = fetcher.fetch();

fetchPagePromise
  .then(($) => {

    console.log(`Full page size: ${$.html().length / 1024}KB.`);
    let $minmize = fetcher.minmize($);
    // TODO for debugging, could delete in release
    // console.log(`Minmized page size: ${$minmize.html().length / 1024}KB.`);

    // save file, optional
    fetcher.save('promiseTest.html', $minmize.html());

    let Analyst = extractor.Analyst;
    let instance = new Analyst();
    instance.extract($minmize, $);
  });