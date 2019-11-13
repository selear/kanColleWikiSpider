const fs = require('fs');

const chalk = require('chalk').default;
const MODEL = require('../model/kaisyuTable');

const CATEGORY_MAP = MODEL.CATEGORY_MAP;
const Category = MODEL.Category;
const EQUIP_MAP = MODEL.EQUIP_MAP;
const Equip = MODEL.Equip;

class Analyst {

  extract(kaisyu, $) {
    console.log(chalk.yellowBright(Decorator.banner(`Content length - ${kaisyu.html().length / 1024}KB`)));

    // Extract data; the instance will set into map automatically by using Category.register(cName) / Equip.register(eName)
    let c = undefined;
    let e = undefined;
    kaisyu.find('table tr').each(function () {

      if ($(this).find('th').length === 1) {
        c = Category.register($(this).find('th').text());
      }

      let $tdSet = $(this).find('td');
      if ($tdSet.first().find('a').length > 0) {

        let eName = $tdSet.first().text();
        e = Equip.register(eName);
        c.addEquip(e);
        e.initSupply($tdSet, true);
        e.addEnhanceCost($tdSet, Equip.NEW_EQUIP);  // done [1,6,7,8]
        e.addAssist($tdSet, true); // done [size - 9,...,size - 2]
      } else if ($tdSet.length === 4 || $tdSet.length === 5) {

        e.addEnhanceCost($tdSet, Equip.OTHER);  // done [0,1,2,3]
      } else if ($tdSet.length === 8) {

        e.addAssist($tdSet); // done [size - 8,...,size - 1]
      } else if ($tdSet.length === 12) {

        e.addEnhanceCost($tdSet, Equip.OTHER);  // done [0,1,2,3]
        e.addAssist($tdSet); // done [size - 8,...,size - 1]
      } else if ($tdSet.length === 17 || $tdSet.length === 18) {

        e.initSupply($tdSet);
        e.addEnhanceCost($tdSet, Equip.NEW_UPGRADE);  // done [0,5,6,7]
        e.addAssist($tdSet, true); // done [size - 9,...,size - 2]
      }
    });
  }

  saveCategory() {
    new Debugger().saveCategory();
  }

  saveEquip() {
    new Debugger().saveEquip();
  }

  displayCategory() {
    new Debugger().displayCategory();
  }

  displayEquip() {
    new Debugger().displayEquip();
  }
}

const FILE_NAME = 'category.js';
const PROJECT_ROOT = '/../../../kanColleEnhanceAssistor/lib/category.js';

class Debugger {

  saveCategory() {
    let categoryArr = [];
    CATEGORY_MAP.forEach(category => {
      categoryArr.push({ id: category.id, name: category.name, equipIdArr: category.equipIdArr });
    });

    fs.writeFile(__dirname.concat(PROJECT_ROOT), JSON.stringify(categoryArr), err => {
      if (!err) {
        console.log(`File >>> ${FILE_NAME} <<< saved`);
      } else {
        console.error(chalk.redBright(err.name, err.message));
      }
    });
  }

  // TODO
  saveEquip() {

  }

  // TODO
  displayCategory() {
    CATEGORY_MAP.forEach(category => {
      let id = Formatter.highlightId(category.id);
      let name = Formatter.highlightName(category.name);
      let equipIdArr = Formatter.highLightArr(category.equipIdArr);
      console.log(`${id}->  ${name}${equipIdArr}`);
    });
  }

  displayEquip() {

    let idx = 0;
    EQUIP_MAP.forEach(equip => {
      let equipBrief = Formatter.equipBrief(equip, idx++);
      let equipSupply = Formatter.supplyBrief(equip.debugSupply());
      let enhanceCost = Formatter.enhanceCostBrief(equip.debugEnhanceCost());
      let assistBrief = Formatter.assistBrief(equip.debugAssist());
      let upgradeBrief = Formatter.upgradeBrief(equip.debugUpgrade());
      console.log(`${equipBrief}${equipSupply}${upgradeBrief}${enhanceCost}${assistBrief}`);
    });
    console.log(Formatter.totalBrief());
  }
}

const SUBGROUP_COUNT = 6;
const INDENT_EQUIP = '-->';
const INDENT_ENHANCE_COST = '\n     | ';
const INDENT_ASSIST = '\n     |--> ';
const INDENT_UPGRADE = '\n     | |-> ';

class Formatter {

  static equipBrief(equip, idx) {
    let str = '';
    str += String(idx).toString().padStart(4);
    str += INDENT_EQUIP + equip.name;
    return str.padEnd(20);
  }

  static supplyBrief(arr) {
    let str = '';
    for (let supply of arr) {
      str += '[';
      str += chalk.blueBright(supply);
      str += ']';
    }
    return str;
  }

  static enhanceCostBrief(enhanceArr) {
    let str = '';
    for (let ecArr of enhanceArr) {
      str += INDENT_ENHANCE_COST;
      for (let ec of ecArr) {
        str += '[' + chalk.cyan(ec.debugCost()) + '][';
        str += chalk.cyanBright(ec.debugPromiseCost()) + '] ';
      }
    }
    return str;
  }

  static assistBrief(arr) {
    let str = '';
    for (let assistsSet of arr) {
      if (assistsSet.length === 1) {
        str += chalk.redBright(INDENT_ASSIST);
        str += chalk.yellowBright(assistsSet);
      } else {
        for (let a of assistsSet) {
          str += chalk.green(INDENT_ASSIST);
          str += chalk.yellow(a);
        }
      }
    }
    return str;
  }

  static upgradeBrief(arr) {
    let str = '';
    for (let upgradeRemark of arr) {
      str += INDENT_UPGRADE + upgradeRemark[0];
      str += INDENT_ENHANCE_COST + chalk.grey(upgradeRemark[1]);
    }
    return str;
  }

  static totalBrief() {
    let str = '';
    str += chalk.yellow(`category.size\t- ${CATEGORY_MAP.size}`);
    str += '\t' + chalk.blueBright(`equip.size\t- ${EQUIP_MAP.size}`);
    return str;
  }

  static highlightId(id) {
    return chalk.grey(String(id).padEnd(12));
  }

  static highlightName(name) {
    return chalk.yellow(name);
  }

  static highLightArr(arr) {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
      if (i % SUBGROUP_COUNT === 0) {
        str += '\n'.padEnd(19);
      }
      str += chalk.blueBright((arr[i]).padEnd(12)) + ', ';
    }
    str = str.substring(0, str.length - 2);
    return str;
  }
}

class Decorator {
  static banner(content) {
    return `--- ${content} ---`;
  }
}

module.exports = {
  'Analyst': Analyst
};