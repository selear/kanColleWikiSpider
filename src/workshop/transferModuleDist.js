let $ = null;

function setDollar(dollar) {
  $ = dollar;
}

function display() {
  console.log(`dist $('li').length - ${$('li').length}`);
  console.log(`dist $('.cherry').length - ${$('.cherry').length}`)
}

export {
  setDollar as set,
  display as display
};