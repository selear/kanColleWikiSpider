const assert = require('assert');

var ValidateDual = function() {

  // 正则表达式在工具网站下测试通过, 测试数据本注释中也有提及, 匹配模式gm
  //   http://regexr.com/

  // 单元测试#两组数字#, 其中字符'/'固定出现, 前后分别为两组正整数
  //   第一组取值范围: [0, 99], ?
  //   第二组取值范围: [1, 99], ?
  //   特殊情况为    : -/-, ?/?
  // regexr.com - regexp
  //   /^(([1-9]?\d|\?)\/([1-9]\d?|\?)|-\/-)$/gm
  // node.js    - regexp
  //   /^(([1-9]?\d|\?)\/([1-9]\d?|\?)|-\/-)$/
  this.REGEXP = /^(([1-9]?\d|\?)\/([1-9]\d?|\?)|-\/-)$/;

  //QM is short for 'question mark', etc. '?'
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
    'special'          : ['-/-','-/ -','- /-','--/-','-/--','--/--'],

    'head_QM'          : ['?/0','?/1','?/9','?/10','?/99','?/100','?/999',
                          '1?/0','1?/1','9?/9','1?/10','1?/99','9?/100','9?/999',
                          '10?/0','10?/1','99?/9','10?/10','10?/99','99?/100','99?/999'],

    'head_QM_dual'     : ['??/0','??/1','??/9','??/10','??/99','??/100','??/999',
                          '1??/0','1??/1','9??/9','1??/10','1??/99','9??/100','9??/999'],

    'foot_QM'          : ['0/?','0/?0','0/?9','0/?10','0/?99',
                          '10/?','10/?0','10/?9','10/?10','10/?99',
                          '99/?','99/?0','99/?9','99/?10','99/?99',
                          '100/?','100/?0','100/?9','100/?10','100/?99'],

    'foot_QM_dual'     : ['0/??','0/??0','0/??9','10/??','10/??0','10/??9',
                          '99/??','99/??0','99/??9','100/??','100/??0','100/??9',
                          '999/??','999/??0','999/??9'],

    'special_QM'       : ['?/?','?/ ?','? /?','??/?','?/??','?? /?',
                          '??/ ?','? /??','?/ ??','??/??','?? /??','??/ ??']
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
    'special'          : ['-/-'],

    'head_QM'          : ['?/1','?/9','?/10','?/99'],
    'head_QM_dual'     : [],
    'foot_QM'          : ['0/?','10/?','99/?'],
    'foot_QM_dual'     : [],
    'special_QM'       : ['?/?']
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

var caseTest = function(target) {

  let regexp = this.REGEXP;
  let validElemArr = this.TEST_CASE[target].filter(function(elem) {
    return regexp.test(elem);
  });
  assert.deepEqual(validElemArr, this.EXPECTED[target], 'error in [' + target + ']');
};

var testSingular = function() {

  let validate = new ValidateSingular();

  caseTest.call(validate, 'singleNum');
  caseTest.call(validate, 'singleNumSpace');
  caseTest.call(validate, 'twoDigits');
  caseTest.call(validate, 'threeDigits');
  caseTest.call(validate, 'special');

  console.log('[success]', '[subTest]Regexp - SINGULAR');
};

var testDual = function() {

  let validate = new ValidateDual();

  caseTest.call(validate, 'head_0');
  caseTest.call(validate, 'head_0_Alphabet');
  caseTest.call(validate, 'head_10');
  caseTest.call(validate, 'head_10_Alphabet');
  caseTest.call(validate, 'head_99');
  caseTest.call(validate, 'head_99_Alphabet');
  caseTest.call(validate, 'head_000');
  caseTest.call(validate, 'head_010');
  caseTest.call(validate, 'head_999');
  caseTest.call(validate, 'special');

  caseTest.call(validate, 'head_QM');
  caseTest.call(validate, 'head_QM_dual');
  caseTest.call(validate, 'foot_QM');
  caseTest.call(validate, 'foot_QM_dual');
  caseTest.call(validate, 'special_QM');

  console.log('[success]', '[subTest]Regexp - DUAL');
};

const EXPORTS = {};
EXPORTS.testDual     = testDual;
EXPORTS.testSingular = testSingular;

module.exports = EXPORTS;