const chalk = require('chalk').default;
const MODEL = require('../model/kaisyuTable');

class Extractor {

  static staticFunc(appendStr) {
    console.log(chalk.yellow(Decorator.banner(`this is static function, ${appendStr}`)));
  }

  static collect(kaisyu) {
    console.log(chalk.red(Decorator.banner('START ANALYSE PAGE')));
    console.log(chalk.blueBright(Decorator.banner('this is static test')));
  }

  instanceFunc(appendStr) {
    console.log(chalk.cyanBright(Decorator.banner(`this is instance method, ${appendStr}`)));
  }
}

class Decorator {
  static banner(content) {
    return `--- ${content} ---`;
  }
}

export {
  Extractor as DataAnalyst
};