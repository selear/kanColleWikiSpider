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
  });

  if(outRangeArr.length > 0)
    return false;

  return true;
};

module.exports = validate;