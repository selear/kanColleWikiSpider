var validate = {};

validate.assistShip = function(str, arr) {
  // 逻辑表达式建议在node命令行下测试或单元测试通过
  //   runtime不同相同, JS执行结果不一定相同
  //   sample: nodejs, chrome下的 'typeof []', 'typeof [1, 2, 3]'
  //           nodejs - 在nodejs shell下, 执行代码['test']就会报错;
  //                  - 执行代码["test"]就不会报错, 具体原因目前尚不明确;
  //                  - 但在js文件中, 执行代码['test'] & ["test"]都不会出错;
  //                  - 'object', 'object'(如执行代码报错, 尝试更新至最新稳定版)
  //           chrome - 'object', 'object'
  if(typeof str != 'string' || (!arr instanceof Array))
    return false;

  // 数组的长度肯定大于等于0
  if(arr.length > 8)
    return false;

  var outRangeArr = arr.filter(function(x) {
           // 可以尝试进一步简化布尔运算式
    return !Number.isInteger(x) || !( x > -1 && x < 7 )
  });

  if(outRangeArr.length > 0)
    return false;

  return true;
};

module.exports = validate;