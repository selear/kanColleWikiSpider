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

    // DEBUG delete this if release, show category numbers
    // console.log(`th.length - ${kaisyu.find('table tr>th').length}`);

    // Extract category data; the instance will set into map automatically by using Category.append(cName)
    kaisyu.find('table tr>th').each(function() {
      // console.log(`    ${ idx }\t${ $(this).text() }`);
      Category.append($(this).text());
    });
    // DEBUG delete this if release
    console.log(`category.size\t- ${CATEGORY_MAP.size}`);

    // Extract category data; the instance will set into map automatically by using Equip.append(eName)
    let idx = 0;
    let e = undefined;
    kaisyu.find('table tr').each(function() {
      let $tdSet = $(this).find('td');
      if($tdSet.first().find('a').length > 0) {
        let eName = $tdSet.first().text();
        // console.log(`   ${ idx++ }\t${ eName }`);
        e = Equip.append(eName);
        console.log(`${idx++} - ${$tdSet.length}`);


      }
    });
    // DEBUG delete this if release;
    console.log(`equip.size\t- ${EQUIP_MAP.size}`);
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