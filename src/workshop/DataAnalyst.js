const chalk = require('chalk').default;
const MODEL = require('../model/kaisyuTable');

const CATEGORY_MAP = MODEL.CATEGORY_MAP;
const Category = MODEL.Category;
const EQUIP_MAP = MODEL.EQUIP_MAP;
const Equip = MODEL.Equip;

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

  extract(kaisyu, $) {
    console.log(chalk.yellowBright(Decorator.banner(`Content length - ${kaisyu.html().length / 1024}KB`)));

    // TODO delete this if release
    // for debug - show category numbers
    // console.log(`th.length - ${kaisyu.find('table tr>th').length}`);

    // extract category data into CATEGORY_MAP
    kaisyu.find('table tr>th').each(function(idx) {
      console.log(`    ${ idx }\t${ $(this).text() }`);
      Category.append($(this).text());
    });
    // TODO delete this if release
    console.log(`category.size - ${CATEGORY_MAP.size}`);

    kaisyu.find('table tr').each(function() {
      let $tdSet = $(this).find('td');
      if($tdSet.first().find('a').length > 0) {
        let eName = $tdSet.first().text();
        Equip.append(eName);
      }
    });
    console.log(`equip.size - ${EQUIP_MAP.size}`);
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