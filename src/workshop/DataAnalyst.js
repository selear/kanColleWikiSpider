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

    // Extract data; the instance will set into map automatically by using Category.register(cName) / Equip.register(eName)
    let idx = 0;
    let c = undefined;
    let e = undefined;
    kaisyu.find('table tr').each(function() {

      if($(this).find('th').length === 1) {
        c = Category.register($(this).text());
      }

      let $tdSet = $(this).find('td');
      if($tdSet.first().find('a').length > 0) {

        let eName = $tdSet.first().text();
        // console.log(`   ${ idx++ }\t${ eName }`);
        e = Equip.register(eName);
        c.addEquip(e);
        e.initSupply($tdSet, true);
        // fixme idx = [1, 6, 7, 8]
        e.addEnhanceCost($tdSet, Equip.NEW_EQUIP);
      } else if ($tdSet.length === 4 || $tdSet.length === 5) {

        // fixme idx = [0, 1, 2, 3]
        e.addEnhanceCost($tdSet, Equip.OTHER);
      } else if ($tdSet.length === 8) {

      } else if ($tdSet.length === 12) {

        // fixme idx = [0, 1, 2, 3]
        e.addEnhanceCost($tdSet, Equip.OTHER);
      } else if ($tdSet.length === 17) {

        e.initSupply($tdSet);
        // fixme idx = [0, 5, 6, 7]
        e.addEnhanceCost($tdSet, Equip.NEW_UPGRADE);
      } else if ($tdSet.length === 18) {

        e.initSupply($tdSet);
        // fixme idx = [0, 5, 6, 7]
        e.addEnhanceCost($tdSet, Equip.NEW_UPGRADE);
      }
      console.log(`${idx++} - ${$tdSet.length} - ${e.name}`);
      // console.log('  ' + chalk.yellowBright(e.supply));
      // Equip.enhance.enhanceCost.stage没有getter, 需要在内部进行测试
      console.log('    ' + chalk.yellowBright(e.enhance.length));
    });
    // DEBUG delete this if release;
    console.log(`category.size\t- ${CATEGORY_MAP.size}`);
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