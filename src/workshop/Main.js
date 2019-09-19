const fetcher = require('./FetchPage');
const extractor = require('./DataAnalyst');

let fetchPagePromise = fetcher.fetch();

fetchPagePromise
  .then(($) => {
    // TODO for debugging, could delete in release
    console.log(`Full page size: ${$.html().length / 1024}KB.`);
    return $;
  })
  .then(($) => {

    let $minmized = fetcher.minmize($);
    // TODO for debugging, could delete in release
    console.log(`Minmized page size: ${$minmized.html().length / 1024}KB.`);

    // store file, optional
    fetcher.save('promiseTest.html', $minmized.html());

  })
  .then(() => {

    let instance = new extractor.DataAnalyst();
    instance.instanceFunc('Foo');
    extractor.DataAnalyst.staticFunc('bar');
    extractor.DataAnalyst.thisIsTest();

  });

  // typeof('test') --> string
  // toString.call('test') / toString.call(new String) --> [object String]
