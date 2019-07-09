const cheerio = require('cheerio');
const src = require('./transferModuleSrc');
const dist = require('./transferModuleDist');

const html = `<ul id="fruits">
    <li class="apple">Apple</li>
    <li class="orange">Orange</li>
    <li class="pear">Pear</li>
  </ul>`

src.set(cheerio);
src.display(html);

dist.set(cheerio);
dist.display(html);