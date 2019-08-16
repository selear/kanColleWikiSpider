//CategoryList
//Category
//Equip

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

//name      - equipName
//assists   - class Assist
class Equip {

  #name;
  #assists = [];

  constructor(name) {
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  set name(str) {
    this.#name = str;
  }

}

//stage   - 0/1/2
//supply  - array.length = 4
//develop - array.length = 2
//enhance - array.length = 2
//equip   - string
class EnhanceDetail {

  #stage;
  #supply;
  #develop;
  #enhance;
  #equip;

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

module.exports = { Equip, EnhanceDetail };