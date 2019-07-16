const fetcher = require('./fetchPage');

let fetchPagePromise = fetcher.fetch();

fetchPagePromise
  .then(($) => {
    let $minmized = fetcher.minmize($);
    // TODO for debugging, could delete in release
    console.log($minmized.html().length / 1024);

    // store file, optional
    fetcher.save('promiseTest.html', $minmized.html());
  });

  // typeof('test') --> string
  // toString.call('test') / toString.call(new String) --> [object String]
