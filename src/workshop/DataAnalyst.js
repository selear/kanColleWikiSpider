const MODEL = require('../model/kaisyuTable');

class Extractor {

  static staticFunc(appendStr) {
    console.log(`--- this is static function, ${appendStr} ---`);
  }

  static thisIsTest(test) {
    console.log(`--- this is static test. ---`)
  }

  instanceFunc(appendStr) {
    console.log(`--- this is instance method, ${appendStr} ---`);
  }
}



export {
  Extractor as DataAnalyst
};