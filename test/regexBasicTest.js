const assert = require('assert');

// 正则表达式在工具网站下测试通过, 测试数据本注释中也有提及, 匹配模式gm
//   http://regexr.com/

//   两组数字测试中, 正则表达式为
//      /\b([1-9]\d|\d)\/([1-9]\d|[1-9])\b|^-\/-$/gm
//   在本测试环境中, 每个测试条件都是单行测试, 由此不需要多行匹配模式m, ^, $
// 变为 /\b([1-9]\d|\d)\/([123456789]\d|[123456789])\b|-\/-/g
/*
     0/0
     0/1    -- T
     0/9    -- T
     0/10   -- T
     0/99   -- T
     0/100
     0/999
 
     0/1a
     0/9b
     0/10c
     0/99d
     0/100e
     0/999f
 
     10/0
     10/1   -- T
     10/9   -- T
     10/10  -- T
     10/99  -- T
     10/100
     10/999
 
     10/1a
     10/9b
     10/10c
     10/99d
     10/100e
     10/999f
 
     99/0
     99/1   -- T
     99/9   -- T
     99/10  -- T
     99/99  -- T
     99/100
     99/999
 
     99/1a
     99/9b
     99/10c
     99/99d
     99/100e
     99/999f
 
     000/0
     000/1
     000/10
     000/99
     000/100
     000/999
 
     010/0
     010/1
     010/10
     010/99
     010/100
     010/999
 
     100/0
     100/1
     100/10
     100/99
     100/100
     100/999
 
     -/-    -- T
     -/ -
     - /-
     --/-
     -/--
     --/--
 */
const TWO_NUMS_REG = /\b([1-9]\d|\d)\/([1-9]\d|[1-9])\b|-\/-/;

const FOR_TEST = {
  'head_0'           : ['0/0','0/1','0/9','0/10','0/99','0/100','0/999'],
  'head_0_Alphabet'  : ['0/1a','0/9b','0/10c','0/99d','0/100e','0/999f'],
  'head_10'          : ['10/0','10/1','10/9','10/10','10/99','10/100','10/999'],
  'head_10_Alphabet' : ['10/1a','10/9b','10/10c','10/99d','10/100e','10/999f'],
  'head_99'          : ['99/0','99/1','99/9','99/10','99/99','99/100','99/999'],
  'head_99_Alphabet' : ['99/1a','99/9b','99/10c','99/99d','99/100e','99/999f'],
  'head_000'         : ['000/0','000/1','000/10','000/99','000/100','000/999'],
  'head_010'         : [],
  'head_999'         : []
};

const EXPECTED = {
  'head_0'           : ['0/1', '0/9', '0/10', '0/99'],
  'head_0_Alphabet'  : [],
  'head_10'          : ['10/1','10/9','10/10','10/99'],
  'head_10_Alphabet' : [],
  'head_99'          : ['99/1','99/9','99/10','99/99'],
  'head_99_Alphabet' : [],
  'head_000'         : [],
  'head_010'         : [],
  'head_999'         : []
};


var validateTwoNums = function(target) {

  var validElemArr = FOR_TEST[target].filter(function(elem) {
    return TWO_NUMS_REG.test(elem);
  });
  assert.deepEqual(validElemArr, EXPECTED[target], 'error in [' + target + ']');
};

validateTwoNums('head_0');
validateTwoNums('head_0_Alphabet');
validateTwoNums('head_10');
validateTwoNums('head_10_Alphabet');
validateTwoNums('head_99');
validateTwoNums('head_99_Alphabet');
validateTwoNums('head_000');
validateTwoNums('head_010');
validateTwoNums('head_999');