const assert = require('assert');

var ValidateDual = function() {

  // 正则表达式在工具网站下测试通过, 测试数据本注释中也有提及, 匹配模式gm
  //   http://regexr.com/

  // 单元测试#两组数字#, 其中字符'/'固定出现, 前后分别为两组正整数
  //   第一组取值范围: [0, 99]
  //   第二组取值范围: [1, 99]
  //   特殊情况为    : -/-
  // 最初regexp
  //   /\b([1-9]\d|\d)\/([1-9]\d|[1-9])\b|-\/-/
  // 优化regexp
  //   /^([1-9]?\d\/[1-9]\d?|-\/-)$/
  // 可能需要添加m
  this.REGEXP = /^([1-9]?\d\/[1-9]\d?|-\/-)$/;

  this.TEST_CASE = {
    'head_0'           : ['0/0','0/1','0/9','0/10','0/99','0/100','0/999'],
    'head_0_Alphabet'  : ['0/1a','0/9b','0/10c','0/99d','0/100e','0/999f'],
    'head_10'          : ['10/0','10/1','10/9','10/10','10/99','10/100','10/999'],
    'head_10_Alphabet' : ['10/1a','10/9b','10/10c','10/99d','10/100e','10/999f'],
    'head_99'          : ['99/0','99/1','99/9','99/10','99/99','99/100','99/999'],
    'head_99_Alphabet' : ['99/1a','99/9b','99/10c','99/99d','99/100e','99/999f'],
    'head_000'         : ['000/0','000/1','000/10','000/99','000/100','000/999'],
    'head_010'         : ['010/0','010/1','010/10','010/99','010/100','010/999'],
    'head_999'         : ['100/0','100/1','100/10','100/99','100/100','100/999'],
    'special'          : ['-/-','-/ -','- /-','--/-','-/--','--/--']
  };

  this.EXPECTED = {
    'head_0'           : ['0/1', '0/9', '0/10', '0/99'],
    'head_0_Alphabet'  : [],
    'head_10'          : ['10/1','10/9','10/10','10/99'],
    'head_10_Alphabet' : [],
    'head_99'          : ['99/1','99/9','99/10','99/99'],
    'head_99_Alphabet' : [],
    'head_000'         : [],
    'head_010'         : [],
    'head_999'         : [],
    'special'          : ['-/-']
  };
};

var ValidateSingular = function() {

  // 单元测试#单组梳子#
  //   取值范围为单位正整数, [0, 9]
  //   取值特殊情况, '-', '', ''的情况可以在抓取数据的时候可以处理掉
  // 最初regexp
  //   /^(\d|-)$/
  // 备用regexp
  //   /^[0-9\-]$/
  this.REGEXP = /^[0-9\-]$/;

  this.TEST_CASE = {
    'singleNum'      : ['0','1','2','3','4','5','6','7','8','9'],
    'singleNumSpace' : [' 0','0 ',' 9','9 '],
    'twoDigits'      : ['00','01','09','10','99'],
    'threeDigits'    : ['000','001','009','010','099','100','999'],
    'special'        : ['-',' -','-- ','---',' --','- -','-- ']
  };

  this.EXPECTED = {
    'singleNum'      : ['0','1','2','3','4','5','6','7','8','9'],
    'singleNumSpace' : [],
    'twoDigits'      : [],
    'threeDigits'    : [],
    'special'        : ['-']
  };
};

var test = function(target) {

  var regexp = this.REGEXP;

  var validElemArr = this.TEST_CASE[target].filter(function(elem) {
    return regexp.test(elem);
  });
  assert.deepEqual(validElemArr, this.EXPECTED[target], 'error in [' + target + ']');
};

var testSingular = function() {

  var validate = new ValidateSingular();

  test.call(validate, 'singleNum');
  test.call(validate, 'singleNumSpace');
  test.call(validate, 'twoDigits');
  test.call(validate, 'threeDigits');
  test.call(validate, 'special');

  console.log('[success]', 'Regexp - SINGULAR');
};

var testDual = function() {

  var validate = new ValidateDual();

  test.call(validate, 'head_0');
  test.call(validate, 'head_0_Alphabet');
  test.call(validate, 'head_10');
  test.call(validate, 'head_10_Alphabet');
  test.call(validate, 'head_99');
  test.call(validate, 'head_99_Alphabet');
  test.call(validate, 'head_000');
  test.call(validate, 'head_010');
  test.call(validate, 'head_999');
  test.call(validate, 'special');

  console.log('[success]', 'Regexp - DUAL');
};

const EXPORTS = {};
EXPORTS.testDual     = testDual;
EXPORTS.testSingular = testSingular;

module.exports = EXPORTS;