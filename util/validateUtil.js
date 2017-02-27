var validate = {};

// 参数arr不是有效参数, 测试项在于——
//   1. 数组元素均为整数, 不包含其他类型的数字, 或数据; 其他数据类型包括:
//      + float
//      + string
//      + array
//      + null
//   2. 数组的合法长度为[0, 7], 测试数组长度大于7的情况
//   3. 数组元素极值范围为[0, 6], 其数值应包含:
//      + 小于最小值的元素;
//      + 大于最大值的元素;
// --4--数组包含重复的合法元素, 从页面抓取的数据一般不会出现该情况
validate.assistShip = function(str, arr) {

  if(typeof str != 'string' || (!arr instanceof Array))
    return false;

  // 数组的长度肯定大于等于0
  if(arr.length > 8)
    return false;

  var invalidElementArr = arr.filter(function(x) {
    //     不是整数 - true      || 数值在[0, 6]区间外 - true
    return !Number.isInteger(x) || ( x < 0 || x > 6 );
  });

  if(invalidElementArr.length > 0)
    return false;

  return true;
};

// 输入参数arr应当满足以下条件:
// 1. 参数类型应当是一个数组;
// 2. 参数长度应固定为4;
// 3. 参数内所有的元素应为正整数, 有效数据范围[0, 2000], 个人最大值不会超过1000
//    不应有的数据类型包括:
//    + 任意负数
//    + 正负浮点数
//    + 超出范围的正整数
//    + 字符串, 数组, FALSY值(主要为null, undefined)
validate.resourceCost = function(arr) {
  if(!arr instanceof Array)
    return false;

  if(arr.length != 4)
    return false;

  var invalidElementArr = arr.filter(function(x) {
    //     不是整数 - true      || 数值在[0, 2000]区间外 - true
    return !Number.isInteger(x) || (x < 0 || x > 2000);
  });

  if(invalidElementArr.length > 0)
    return false;

  return true;
};

module.exports = validate;// 输入参数arr中的数据分布为[int, string, string, string]应满足以下条件:
// 1. 输入参数类型应为数组;
// 2. 输入参数(数组)长度应为固定值 --> 4;
// 3. 整数范围[0, 2];
// 4. 字符串字符取值范围为[-/0123456789], 可能出现的情况为:
//    + 前两个字符串, 可能出现的情况有: Range01/Range02, -/-; 没有混用情况;
//    + 最后的字符串, 可能出现的情况有: Range01, -, BLANK_STR;
//    + Range01范围[0, 99], 最大值为推定值
//    + Range02范围(0, 99], 最大值为推定值
//    + 详细测试参见regexTest.js
validate.improveDetail = function(arr) {
  if(!Array.isArray(arr))
    return false;

  if(arr.length != 4)
    return false;

  var intElem = arr.shift();
  if(!Number.isInteger(intElem) && (intElem < 0 || intElem > 3))
    return false;

};

module.exports = validate;v