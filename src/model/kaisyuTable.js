//CategoryList
//Category
//Equip

let shortId = require('shortid');

const TYPE = {
  STRING: (() => {
    return toString.call({});
  })(),
  ARRAY: (() => {
    return toString.call([]);
  })(),
  whichItIs: function (param) {
    return toString.call(param);
  }
};

const CATEGORY = new Map();
const EQUIP = new Map();

class Category {
  
  #sid;
  #name;
  #equipIds = [];

  constructor(cName) {
    this.#sid = shortId.generate();
    this.#name = cName;
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
  addEquipId(equipId) {
    this.#equipIds.push(equipId);
  }

  // 根据名字创建实例，并将实例写入到CategoryMap中；其他模块调用时，无需额外再写入Map一次
  static append(cName) {
    let c = new Category(cName);
    CATEGORY.set(c.id, c);
    return c;
  }
}

//name      - equipName
//assists   - class Assist
class Equip {

  #sid;
  #name;
  #assists = [];

  constructor(name) {
    this.#sid = shortId.generate();
    this.#name = name;
  }

  //gettter
  get id() {
    return this.#sid;
  }
  get name() {
    return this.#name;
  }
  get assists() {
    return this.#assists;
  }

  //setter
  set name(str) {
    this.#name = str;
  }

  addAssist(assist) {
    const VALID_ARRAY_LENGTH = 2;
    //TODO Push assist into assists if it's valid; total length of assists should be 2
    if (assist.length && assist.length < VALID_ARRAY_LENGTH) {
      this.#assists.push(assist);
    } else {
      //TODO log error:
    }
  }

  // 根据名字创建实例，并将实例写入到CategoryMap中；其他模块调用时，无需额外再写入Map一次
  static append(eName) {
    let e = new Equip(eName);
    EQUIP.set(e.id, e);
    return e;
  }
}

//names       - class AssistShip
//upgradeTo   - null/equipName
//remark      - remark
//enhanceCost - class EnhanceCost
class Assist {

  #names = [];
  #upgradeTo;
  #remark;
  #enhanceCost;

  //setter
  set names(nameArray) {
    this.#names = nameArray;
  }
  set upgradeTo(toNext) {
    this.#upgradeTo = toNext;
  }
  set remark(remark) {
    this.#remark = remark;
  }
  set enhanceCost(enhanceCostInstance) {
    this.#enhanceCost = enhanceCostInstance;
  }

  //getter
  get names() {
    return this.#names;
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
}

class AssistShip {

  #name;
  #canUpgrade = undefined;
  #accessDay;

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
}

//stage   - 0/1/2
//supply  - array.length = 4
//develop - array.length = 2
//enhance - array.length = 2
//equip   - string
class EnhanceCost {

  #stage;
  #supply;
  #develop;
  #enhance;
  #equip;

  //setter
  set stage(stage) {
    this.#stage = stage;
  }
  set supplyCost(arr) {
    this.#supply = processSupplyRaw(arr);
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

  //getter
  get supplyCost() {
    return this.#supply;
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
}

/*
  INPUT   :  array/anything
  OUTPUT  :  array/undefined
  INVALID :  LOG information
 */
function processSupplyRaw(beArray) {

  const SUPPLY_TYPE_COUNT = 4;

  // 比较起toString.call(beArray) !== '[object Array]'
  // 我认为instanceof的方法更加有利, 因为字符串判断更加耗费性能
  if (!(beArray instanceof Array)) {
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
 */
//在调用该函数之前, 就应该保证参数beStringOrArray是一个合规参数;
//如果是字符串, 应当属于'-/-', '12/34'的形式, 不能有更多的数据.
//如果是数组, 则数组长度应当为2. etc
//
//判定条件较为复杂且内容较多, 使用switch语句并不合适.
function processDevelopEnhanceRaw(beStringOrArray) {

  const VALID_LENGTH = 2;
  let type = TYPE.whichItIs(beStringOrArray);

  let returnVal = undefined;
  if (type === TYPE.STRING && beStringOrArray.indexOf('/') !== -1) {
    if (beStringOrArray.split('/').length === VALID_LENGTH) {
      returnVal = beStringOrArray.split('/');
    } else {
      //TODO log error: invalid array length, %{ showing invalid param here }.
    }
  } else {
    //TODO log error: invalid param content, %{ showing invalid param here }.
  }
  // noinspection JSObjectNullOrUndefined
  if (type === TYPE.ARRAY && returnVal.length === VALID_LENGTH) {
    returnVal = beStringOrArray;
  } else {
    //TODO log error: invalid array length, %{ showing invalid param here }.
  }

  return returnVal;
}

/*
  INPUT   :  string/anything
  OUTPUT  :  string/undefined
  INVALID :  LOG information
 */
function processEquipAmountRaw(beString) {

  const VALID_LENGTH = 1;

  let returnVal;
  if (TYPE.whichItIs(beString) !== TYPE.STRING) {
    //TODO log error: invalid param type, %{ showing %type here }
    returnVal = undefined;
  }
  if (beString.length === VALID_LENGTH) {
    returnVal = beString;
  } else {
    //TODO log error: Invalid param length, %{ showing param here }.
    returnVal = undefined;
  }

  return returnVal;
}

module.exports = {
  'Category': Category,
  'Equip': Equip,
  'CATEGORY_MAP': CATEGORY,
  'EQUIP_MAP': EQUIP
};