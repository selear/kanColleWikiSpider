//CategoryList
//Category
//Equip

let shortId = require('shortid');

const TYPE = {
  STRING: (() => {
    return toString.call("");
  })(),
  ARRAY: (() => {
    return toString.call([]);
  })(),
  whichItIs: function (param) {
    return toString.call(param);
  }
};

const NOT_FOUND = -1;
const UPGRADE_SIGN = '⇒';
const CAN = '〇';
const NOT = '×';

const NEW_EQUIP = 'newEquip';
const NEW_UPGRADE = 'newUpgrade';
const OTHER = 'other';

const EQUIP_SUPPLY_INDEX_PRESET = {
  'newEquip' : [2, 3, 4, 5],
  'other'    : [1, 2, 3, 4]
};
const EQUIP_ENHANCE_COST_INDEX_PRESET = {
  'newEquip'    : [1, 6, 7, 8],
  'newUpgrade'  : [0, 5, 6, 7],
  'other'       : [0, 1, 2, 3]
};

const ENHANCE_COST_PHASE_PRESET = ['初期', '★6', '★max'];

const CATEGORY = new Map();
const EQUIP = new Map();

class Category {
  
  #sid;
  #name;
  #equipIds;

  constructor(cName) {
    this.#sid = shortId.generate();
    this.#name = cName;
    this.#equipIds = [];
  }

  //getter
  get id() {
    return this.#sid;
  }
  get name() {
    return this.#name;
  }

  addEquip(equip) {
    this.#equipIds.push(equip.id);
  }

  // 根据名字创建实例，并将实例写入到CategoryMap中；其他模块调用时，无需额外再写入Map一次
  static register(cName) {
    let c = new Category(cName);
    CATEGORY.set(c.id, c);
    return c;
  }
}

//name    - equipName
//enhance - [ <Enhance> ]
class Equip {

  #sid;
  #name;
  #enhance;

  // 指向当前enhance
  #currEnhance;

  constructor(name) {
    this.#sid = shortId.generate();
    this.#name = name;
    this.#enhance = [];
  }

  //gettter
  get id() {
    return this.#sid;
  }
  get name() {
    return this.#name;
  }
  get enhance() {
    return this.#enhance;
  }
  get supply() {
    let retVal = [];
    if (this.#enhance.length === 1) {
      retVal.push([this.enhance[0].supplyCost]);
    } else if (this.#enhance.length === 2) {
      retVal.push([this.enhance[0].supplyCost, this.enhance[1].supplyCost]);
    }
    return retVal;
  }

  // TODO
  assistStatus() {
    let arr = [];
    for(let e of this.#enhance) {
      arr.push(e.assistStatus());
    }
    return arr;
  }

  //setter
  set name(str) {
    this.#name = str;
  }

  addEnhance(enhance) {
    const VALID_ARRAY_LENGTH = 2;
    //TODO Push enhance into enhance if it's valid; total length of enhance should be 2
    if (this.#enhance && this.#enhance.length < VALID_ARRAY_LENGTH) {
      this.#enhance.push(enhance);
    } else {
      //TODO log error:
    }
  }
  initSupply(cheerioObj, isNewEquip) {
    let enh = new Enhance();
    enh.initSupply(cheerioObj, isNewEquip);
    this.#enhance.push(enh);
    this.#currEnhance = enh;
  }
  addEnhanceCost(cheerioObj, idxType) {
    this.#currEnhance.addEnhanceCost(cheerioObj, idxType);
  }
  addAccessDay(cheerioObj, isNewAssist) {
    this.#currEnhance.addAccessDay(cheerioObj, isNewAssist);
  }

  // outsiders will think they are CONSTANTS of a class;
  // of course, these CAN NOT be changed.
  static get NEW_EQUIP() {
    return NEW_EQUIP;
  }
  static get NEW_UPGRADE() {
    return NEW_UPGRADE;
  }
  static get OTHER() {
    return OTHER;
  }

  // 根据名字创建实例，并将实例写入到CategoryMap中；其他模块调用时，无需额外再写入Map一次
  static register(eName) {
    let e = new Equip(eName);
    EQUIP.set(e.id, e);
    return e;
  }
}

//assistShips - [ <AssistShip> ]
//upgradeTo   - null/equipName
//remark      - remark
//enhanceCost - [ <EnhanceCost> ]
//develop     - array.length = 2
class Enhance {

  #assistShips;
  #upgradeTo;
  #remark;
  #enhanceCost;
  #supply;

  #currAssistUpgrade;

  constructor() {
    this.#assistShips = [];
    this.#enhanceCost = [];
    this.#currAssistUpgrade = undefined;
  }

  //getter
  get assistShips() {
    return this.#assistShips;
  }
  get upgradeTo() {
    return this.#upgradeTo;
  }
  get remark() {
    return this.#remark;
  }
  get enhanceCost() {
    return this.#enhanceCost;
  }
  get supplyCost() {
    return this.#supply;
  }

  // TODO
  assistStatus() {
    let arr = [];
    for(let a of this.#assistShips) {
      arr.push([a.canUpgrade, a.name, a.accessDay]);
    }
    return arr;
  }

  //setter
  set assistShips(nameArray) {
    this.#assistShips = nameArray;
  }
  set upgradeTo(toNext) {
    this.#upgradeTo = toNext;
  }
  set remark(remark) {
    this.#remark = remark;
  }
  set enhanceCost(enhanceCost) {
    this.#enhanceCost = enhanceCost;
  }
  // fixme 该方法可能用不到, 需要决定去留
  // set supplyCost(arr) {
  //   this.#supply = processSupplyRaw(arr);
  // }

  // isNewEquip true时, 取EQUIP_SUPPLY_INDEX_PRESET.newEquip
  //           false时, 取EQUIP_SUPPLY_INDEX_PRESET.other
  initSupply(cheerioObj, isNewEquip) {
    let idx = EQUIP_SUPPLY_INDEX_PRESET.newEquip;
    if(!isNewEquip) {
      idx = EQUIP_SUPPLY_INDEX_PRESET.other;
    }
    this.#supply = processSupplyRaw([cheerioObj.eq(idx[0]).text(),
      cheerioObj.eq(idx[1]).text(), cheerioObj.eq(idx[2]).text(), cheerioObj.eq(idx[3]).text()]);
  }
  addEnhanceCost(cheerioObj, idxType) {
    let idx = EQUIP_ENHANCE_COST_INDEX_PRESET[idxType];
    let ec = new EnhanceCost();
    ec.stage = EnhanceCost.findPhase(cheerioObj.eq(idx[0]).text().trim());
    ec.developCost = cheerioObj.eq(idx[1]).text();
    ec.enhanceCost = cheerioObj.eq(idx[2]).text();
    ec.equipAmount = cheerioObj.eq(idx[3]).text();
  }
  addAccessDay(cheerioObj, isNewAssist) {

    let adBeginIdx;
    let adEndIndex;
    let assist = new AssistShip();
    let ad = [];
    if(isNewAssist) {
      adBeginIdx = cheerioObj.length - 9;
      adEndIndex = cheerioObj.length - 2;
      this.#currAssistUpgrade = AssistShip.canUpgrade(
        cheerioObj.eq(cheerioObj.length - 1).text().trim());
    } else {
      adBeginIdx = cheerioObj.length - 8;
      adEndIndex = cheerioObj.length - 1;
    }
    assist.name = cheerioObj.eq(adEndIndex).text().trim();
    for(let i = adBeginIdx, day = 0; i < adEndIndex; i++, day++) {
      if (AssistShip.canAccess(cheerioObj.eq(i).text().trim())) {
        ad.push(day);
      }
    }
    assist.canUpgrade = this.#currAssistUpgrade;
    assist.accessDay = ad;
    this.#assistShips.push(assist);
  }
}

class AssistShip {

  #name;
  #canUpgrade = undefined;
  #accessDay;

  //getter
  get name() {
    return this.#name;
  }
  get canUpgrade() {
    return this.#canUpgrade;
  }
  get accessDay() {
    return this.#accessDay;
  }

  //setter
  set name(shipName) {
    this.#name = shipName;
  }
  set canUpgrade(flag) {
    this.#canUpgrade = flag;
  }
  set accessDay(dayArray) {
    this.#accessDay = dayArray;
  }

  static canAccess(dayStr) {
    return (dayStr === CAN ? true : false);
  }
  static canUpgrade(remarkStr) {
    return (remarkStr.indexOf(UPGRADE_SIGN) === NOT_FOUND ? false : true);
  }
}

//stage   - 0/1/2
//develop - array.length = 2
//enhance - array.length = 2
//equip   - string
class EnhanceCost {

  #stage;
  #develop;
  #enhance;
  #equip;

  //getter
  get stage() {
    return this.#stage;
  }
  get developCost() {
    return this.#develop;
  }
  get enhanceCost() {
    return this.#enhance;
  }
  get equipAmount() {
    return this.#equip;
  }
  get cost() {
    let develop = fixCostVal(this.#develop, 0);
    let enhance = fixCostVal(this.#enhance, 0);
    return [this.#stage, develop, enhance, this.#equip];
  }
  get promiseCost() {
    let develop = fixCostVal(this.#develop, 1);
    let enhance = fixCostVal(this.#enhance, 1);
    return [this.#stage, develop, enhance, this.#equip];
  }

  //setter
  set stage(stage) {
    this.#stage = stage;
  }
  set developCost(strOrArr) {
    this.#develop = processDevelopEnhanceRaw(strOrArr);
  }
  set enhanceCost(strOrArr) {
    this.#enhance = processDevelopEnhanceRaw(strOrArr);
  }
  set equipAmount(str) {
    this.#equip = processEquipAmountRaw(str);
  }

  static findPhase(strToTransfer) {
    // fixme
    if (ENHANCE_COST_PHASE_PRESET.indexOf(strToTransfer) === -1) {
      // TODO console.err()
      console.error('ERROR DATA FOUND!!!!!!!!!');
    }
    return ENHANCE_COST_PHASE_PRESET.indexOf(strToTransfer);
  }
}

/*
  INPUT   :  array/anything
  OUTPUT  :  array/undefined
  INVALID :  LOG information
 */
function processSupplyRaw(beArray) {

  const SUPPLY_TYPE_COUNT = 4;

  // 一共有三种方法用于判断:
  // 1. toString.call(beArray) !== '[object Array]'
  // 2. instanceof Array
  // 3. Array.isArray
  // 我认为instanceof的方法更加有利, 因为字符串判断更加耗费性能, 先采用isArray方法
  if (!(Array.isArray(beArray))) {
    //TODO log error: Type check failed, type should be Array, current type is %param.
    return undefined;
  }
  if (beArray.length !== SUPPLY_TYPE_COUNT) {
    //TODO log error: Invalid param. %{ showing invalid param here }.
    return undefined;
  }
  //TODO foreach element in array, it should be Numeric, and range should be between 1 - 999.
  return beArray;
}

/*
  INPUT   :  array/string/anything
  OUTPUT  :  array/undefined
  INVALID :  LOG information

  在调用该函数之前, 就应该保证参数beStringOrArray是一个合规参数;
  如果是字符串, 应当属于'-/-', '12/34'的形式, 不能有更多的数据.
  如果是数组, 则数组长度应当为2. etc

  判定条件较为复杂且内容较多, 使用switch语句并不合适.
 */
function processDevelopEnhanceRaw(beStringOrArray) {

  const VALID_LENGTH = 2;
  let paramType = TYPE.whichItIs(beStringOrArray);

  let returnArray = undefined;
  if (paramType === TYPE.STRING && beStringOrArray.indexOf('/') !== -1) {
    if (beStringOrArray.split('/').length === VALID_LENGTH) {
      returnArray = beStringOrArray.split('/');
    } else {
      //TODO log error: invalid array length, %{ showing invalid param here }.
    }
  } else {
    //TODO log error: invalid param content, %{ showing invalid param here }.
  }
  // no inspection JSObject, Null, Undefined
  if (paramType === TYPE.ARRAY && beStringOrArray.length === VALID_LENGTH) {
    return beStringOrArray;
  } else {
    //TODO log error: invalid array length, %{ showing invalid param here }.
  }

  return returnArray;
}

/*
  INPUT   :  string/anything
  OUTPUT  :  string/undefined
  INVALID :  LOG information
 */
function processEquipAmountRaw(beString) {

  const VALID_LENGTH = 1;

  let returnVal = undefined;
  if (TYPE.whichItIs(beString) !== TYPE.STRING) {
    //TODO log error: invalid param type, %{ showing %type here }
  }
  if (beString.length === VALID_LENGTH) {
    returnVal = beString;
  } else {
    //TODO log error: Invalid param length, %{ showing param here }.
  }

  return returnVal;
}

function fixCostVal(beArr, dataIdx) {

  if(Array.isArray(beArr)) {
    return beArr[dataIdx];
  } else {
    console.log('beArr is not array');
    return -1;
  }
}

module.exports = {
  'Category': Category,
  'Equip': Equip,
  'CATEGORY_MAP': CATEGORY,
  'EQUIP_MAP': EQUIP
};