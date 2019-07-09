let cheerio = null;

function setEnvironment(module) {
  cheerio = module;
}

function display(html) {
  let $ = cheerio.load(html);
  console.log(`dist $('li.apple').length - ${$('li.apple').length}`);
  console.log(`dist $('.plum').length - ${$('.plum').length}`);
}

export {
  setEnvironment as set,
  display as display
};