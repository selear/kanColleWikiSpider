const cheerio = require('cheerio');

let html = `<ul id="fruits">
    <li class="apple">Apple</li>
    <li class="orange">Orange</li>
    <li class="pear">Pear</li>
  </ul></div>`;

const $ = cheerio.load(html);

console.log(` src $('li').length - ${$('li').length}`);

export { $ };