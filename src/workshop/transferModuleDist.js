let cheerio = null;

let html = `<ul id="fruits">
    <li class="apple">Apple</li>
    <li class="orange">Orange</li>
    <li class="pear">Pear</li>
  </ul></div>`;

function setCheerio(cheerioMod) {
  cheerio = cheerioMod;
}

function display() {

  // console.log(`type cheerio - ${cheerio}`);

  let $ = cheerio.load(html);
  console.log(`dist $('li').length - ${$('li').length}`);
  console.log(`dist $('.cherry').length - ${$('.cherry').length}`)
}

export{
  setCheerio as set,
  display as display
};