// 本文件主要用于运行 环境测试 & 单元测试
const assert   = require('assert');
const validate = require('../util/validateUtil');

var assistShip   = validate.assistShip;
var resourceCost = validate.resourceCost;


// runtime基础功能测试
assert.notEqual('str', typeof []);
assert.equal('object', typeof []);
assert.equal('object', typeof [1, 2, 3]);

assert.notEqual('str', typeof [1, 2, 3, "strElement"]);
assert.equal('object', typeof [1, 2, 3, 'strElement']);
// node.js - v6.9.5 shell, 新建包含字符串元素的数组, 使用双引号可行, 单引号报错
//   js文件中, 两种写法都有效, 此处这么写是为了人工验证这两种情况
//   后经过验证, 在cygwin命令行下出现该问题, 可能与nodejs在不同shell下运行有关
//   理论上, 基础功能测试不再需要
assert.equal('object', typeof [1, 2, 3, "strElement"]);

console.log('[success]', '基础测试 - 语法');


// 函数单元测试
//   将预先设置好的变量放入valid, invalid两个对象中一个最主要的考虑 - 代码可读性
//   1. 考虑过只使用一个对象存放, 固然可以提高空间利用率, 但代码可读性降低;
//   2. 分成两个对象, 调用时分别引用, 能快速识别输入参数是[有效参数][无效参数];
var valid = {
  'blankStr'   : '',
  'normalStr'  : 'NORMAL_STRING',
  'emptyArr' : [],
  'fullArr'  : [0, 1, 2, 3, 4, 5, 6]
};

var invalid = {
  'zero' : 0,
  'negativeInt' : -10,
  'negativeFloat' : -200.5674,
  'emptyArr' : [],
  'nil' : null,

  'elemFloat'     : [5.349, 0, 1, 2, 6],
  'elemStrInt'    : [0, 1, 2, 6, '5'],
  'elemStr'       : ['str content', 0, 1, 2, 6],
  'elemArrEmpty'  : [2, 4, [], 6, 1],
  'elemArrFull'   : [2, 4, 6, 1, [0, 2, 5]],
  'elemNull'      : [6, 2, 4, null, 0],

  'elemOver'      : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  'elemLT'        : [0, 1, 2, -5],
  'elemGT'        : [1000, 1, 2, 4, 5, 6]
};

// assistShip(str, arr)
//   str, arr都为有效值
assert.equal(assistShip(valid.blankStr,  valid.emptyArr), true);
assert.equal(assistShip(valid.blankStr,  valid.fullArr), true);
assert.equal(assistShip(valid.normalStr, valid.emptyArr), true);
assert.equal(assistShip(valid.normalStr, valid.fullArr), true);

//   str为无效值, 测试项在于str的类型不是String
assert.equal(assistShip(invalid.zero, valid.emptyArr), false);
assert.equal(assistShip(invalid.zero, valid.fullArr), false);
assert.equal(assistShip(invalid.negativeInt, valid.emptyArr), false);
assert.equal(assistShip(invalid.negativeInt, valid.fullArr), false);
assert.equal(assistShip(invalid.emptyArr, valid.emptyArr), false);
assert.equal(assistShip(invalid.emptyArr, valid.fullArr), false);
assert.equal(assistShip(invalid.nil, valid.emptyArr), false);
assert.equal(assistShip(invalid.nil, valid.fullArr), false);

//   arr为无效值, 具体参见函数说明文档
assert.equal(assistShip(valid.normalStr, invalid.elemFloat), false);
assert.equal(assistShip(valid.normalStr, invalid.elemStrInt), false);
assert.equal(assistShip(valid.normalStr, invalid.elemStr), false);
assert.equal(assistShip(valid.normalStr, invalid.elemArrEmpty), false);
assert.equal(assistShip(valid.normalStr, invalid.elemArrFull), false);
assert.equal(assistShip(valid.normalStr, invalid.elemNull), false);
assert.equal(assistShip(valid.normalStr, valid.emptyArr), true);
assert.equal(assistShip(valid.normalStr, invalid.elemOver), false);
assert.equal(assistShip(valid.normalStr, invalid.elemLT), false);
assert.equal(assistShip(valid.normalStr, invalid.elemGT), false);

console.log('[success]', '函数测试 - assistShip')


