// CategoryList
// Category
// Equip

const TYPE = {
  STRING: '[object String]',
  ARRAY: '[object Array]',
  whichItIs: function (param) {
    return toString.call(param);
  }
};

class Equip {

  #meta;
  #name;

  constructor(name) {
    this.#name = name;
  }

  get name() {
    return this.#name;
  }
}

class EnhanceCost {

  #stage;       // 0, 1, 2
  #supplyMeta;  // should be Array, length = 4
  #developMeta; // should be Array, length = 2
  #enhanceMeta; // should be Array, length = 2
  #equipMeta;   // should be String

  set supply(arr) {
    this.#supplyMeta = processSupplyRaw(arr);
  }

  set develop(strOrArr) {
    this.#developMeta = processDevelopEnhanceRaw(strOrArr);
  }

  set enhance(strOrArr) {
    this.#enhanceMeta = processDevelopEnhanceRaw(strOrArr);
  }

  set equipAmount(str) {
    this.#equipMeta = processEquipAmountRaw(str);
  }

  get supply() {
    return this.#supplyMeta;
  }

  get develop() {
    return this.#developMeta;
  }

  get enhance() {
    return this.#enhanceMeta;
  }

  get equipAmount() {
    return this.#equipMeta;
  }
}

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

function processEquipAmountRaw(beString) {

  const VALID_LENGTH = 1;
  let type = TYPE.whichItIs(beString);

  let returnVal;
  if (type !== TYPE.STRING) {
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

module.exports = {  };