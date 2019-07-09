let cheerio = null;

function setEnvironment(module) {
  cheerio = module;
}

function display(html) {
  let $ = cheerio.load(html);
  console.log(`src $('li').length - ${$('li').length}`);
  console.log(`src $('.cherry').length - ${$('.cherry').length}`);
}

export {
  setEnvironment as set,
  display as display
};