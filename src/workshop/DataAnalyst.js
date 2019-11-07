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
        e = Equip.register(eName);
        c.addEquip(e);
        e.initSupply($tdSet, true);
        e.addEnhanceCost($tdSet, Equip.NEW_EQUIP);  // done [1,6,7,8]
        e.addAccessDay($tdSet, true); // done [size - 9,...,size - 2]
      } else if ($tdSet.length === 4 || $tdSet.length === 5) {

        e.addEnhanceCost($tdSet, Equip.OTHER);  // done [0,1,2,3]
      } else if ($tdSet.length === 8) {

        e.addAccessDay($tdSet); // done [size - 8,...,size - 1]
      } else if ($tdSet.length === 12) {

        e.addEnhanceCost($tdSet, Equip.OTHER);  // done [0,1,2,3]
        e.addAccessDay($tdSet); // done [size - 8,...,size - 1]
      } else if ($tdSet.length === 17) {

        e.initSupply($tdSet);
        e.addEnhanceCost($tdSet, Equip.NEW_UPGRADE);  // done [0,5,6,7]
        e.addAccessDay($tdSet, true); // done [size - 9,...,size - 2]
      } else if ($tdSet.length === 18) {

        e.initSupply($tdSet);
        e.addEnhanceCost($tdSet, Equip.NEW_UPGRADE); // done [0,5,6,7]
        e.addAccessDay($tdSet, true); // done [size - 9,...,size - 2]
      }
    });
    // DEBUG delete this if release;
    console.log(`category.size\t- ${CATEGORY_MAP.size}`);
    console.log(`equip.size\t- ${EQUIP_MAP.size}`);
    new Debugger().displayEquip();
  }
}

class Debugger {

  displayEquip() {

    let idx = 0;
    EQUIP_MAP.forEach(function(e) {
      let equipBrief = Formatter.equipBrief(e, idx++);
      let equipSupply = Formatter.supplyBrief(e.debugSupply());
      let enhanceCost = Formatter.enhanceCostBrief(e.debugEnhanceCost());
      let assistBrief = Formatter.assistBrief(e.debugAssist());
      console.log(
        `${equipBrief.padEnd(24)}${equipSupply}${enhanceCost}${assistBrief}`);
    })
  }
}

const INDENT_EQUIP = ' |-';
const INDENT_ENHANCE_COST = '\n     | ';
const INDENT_ASSIST = '\n     |-> ';
class Formatter {

  static equipBrief(equip, idx) {
    let str = '';
    str += new String(idx).toString().padStart(4);
    str += INDENT_EQUIP + equip.name;
    return str;
  }

  static supplyBrief(arr) {
    let str = '';
    for(let supply of arr) {
      str += '[';
      str += chalk.blueBright(supply);
      str += ']';
    }
    return str;
  }

  static enhanceCostBrief(enhanceArr) {
    let str = '';
    for(let ecArr of enhanceArr) {
      str += INDENT_ENHANCE_COST;
      for(let ec of ecArr) {
        str += '[' + chalk.cyan(ec.debugCost()) + ']['
        str += chalk.cyanBright(ec.debugPromiseCost()) + '] ';
      }
    }
    return str;
  }

  static assistBrief(arr) {
    let str = '';
    for(let assistsSet of arr) {
      if(assistsSet.length === 1) {
        str += chalk.redBright(INDENT_ASSIST);
        str += chalk.yellowBright(assistsSet);
      } else {
        for(let a of assistsSet) {
          str += chalk.green(INDENT_ASSIST);
          str += chalk.yellow(a);
        }
      }
    }
    return str;
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