// 本文件主要用于运行 环境测试 & 单元测试
const assert   = require('assert');
const validate = require('../util/validateUtil');

var assistShip   = validate.assistShip;
var resourceCost = validate.resourceCost;

// 将预先设置好的变量放入valid, invalid两个对象中一个最主要的考虑 - 代码可读性
//   1. 考虑过只使用一个对象存放, 固然可以提高空间利用率, 但代码可读性降低;
//   2. 分成两个对象, 调用时分别引用, 能快速识别输入参数是[有效参数][无效参数];
//   3. 执行不同函数单元测试时, 可直接覆盖以下两个对象;
var valid = null;
var invalid = null;

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

// 函数assistShip(str, arr)单元测试
valid = {
  'blankStr'   : '',
  'normalStr'  : 'NORMAL_STRING',
  'emptyArr' : [],
  'fullArr'  : [0, 1, 2, 3, 4, 5, 6]
};

invalid = {
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

// str, arr都为有效值
assert.equal(assistShip(valid.blankStr,  valid.emptyArr), true);
assert.equal(assistShip(valid.blankStr,  valid.fullArr), true);
assert.equal(assistShip(valid.normalStr, valid.emptyArr), true);
assert.equal(assistShip(valid.normalStr, valid.fullArr), true);

// str为无效值, 测试项在于str的类型不是String
assert.equal(assistShip(invalid.zero, valid.emptyArr), false);
assert.equal(assistShip(invalid.zero, valid.fullArr), false);
assert.equal(assistShip(invalid.negativeInt, valid.emptyArr), false);
assert.equal(assistShip(invalid.negativeInt, valid.fullArr), false);
assert.equal(assistShip(invalid.emptyArr, valid.emptyArr), false);
assert.equal(assistShip(invalid.emptyArr, valid.fullArr), false);
assert.equal(assistShip(invalid.nil, valid.emptyArr), false);
assert.equal(assistShip(invalid.nil, valid.fullArr), false);

// arr为无效值, 具体参见函数说明文档
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

console.log('[success]', 'function assistShip(str, arr)');

// resourceCost(arr)单元测试, 实际判断条件区间为[0, 2000]
//   个人认为实际合理范围为[0, 999], 随着数据更新可能扩增
valid = {
  'fuel'    : ['999', '0', '0', '0'],
  'ammo'    : ['0', '999', '0', '0'],
  'steel'   : ['0', '0', '999', '0'],
  'bauxite' : ['0', '0', '0', '999'],
  'full'    : ['999', '999', '999', '999']
};

invalid = {
  'negative' : {
    'fuel'    : ['-10', '0', '0', '0'],
    'ammo'    : ['0', '-100', '0', '0'],
    'steel'   : ['0', '0', '-1000', '0'],
    'bauxite' : ['0', '0', '0', '-10000'],
    'full'    : ['-10', '-100', '-1000', '-10000']
  },

  'floatNum' : {
    'fuel'    : ['-1.1', '0', '0', '0'],
    'ammo'    : ['0', '-10.2', '0', '0'],
    'steel'   : ['0', '0', '100.345', '0'],
    'bauxite' : ['0', '0', '0', '1000.678'],
    'full'    : ['100.345', '-10.2', '-1.1', '1000.678']
  },

  'greaterThan' : {
    'fuel'    : ['2001', '0', '0', '0'],
    'ammo'    : ['0', '2001', '0', '0'],
    'steel'   : ['0', '0', '2001', '0'],
    'bauxite' : ['0', '0', '0', '2001'],
    'full'    : ['2001', '2001', '2001', '2001']
  },
  
  'nil' : {
    'fuel'    : [null, '0', '0', '0'],
    'ammo'    : ['0', undefined, '0', '0'],
    'steel'   : ['0', '0', null, '0'],
    'bauxite' : ['0', '0', '0', undefined],
    'full'    : [undefined, null, undefined, null]
  }
};

// arr为有效值
assert.equal(resourceCost(valid.fuel), true);
assert.equal(resourceCost(valid.ammo), true);
assert.equal(resourceCost(valid.steel), true);
assert.equal(resourceCost(valid.bauxite), true);
assert.equal(resourceCost(valid.full), true);

// arr为无效值, 具体参见函数说明文档
assert.equal(resourceCost(invalid.negative.fuel), false);
assert.equal(resourceCost(invalid.negative.ammo), false);
assert.equal(resourceCost(invalid.negative.steel), false);
assert.equal(resourceCost(invalid.negative.bauxite), false);
assert.equal(resourceCost(invalid.negative.full), false);

assert.equal(resourceCost(invalid.floatNum.fuel), false);
assert.equal(resourceCost(invalid.floatNum.ammo), false);
assert.equal(resourceCost(invalid.floatNum.steel), false);
assert.equal(resourceCost(invalid.floatNum.bauxite), false);
assert.equal(resourceCost(invalid.floatNum.full), false);

assert.equal(resourceCost(invalid.greaterThan.fuel), false);
assert.equal(resourceCost(invalid.greaterThan.ammo), false);
assert.equal(resourceCost(invalid.greaterThan.steel), false);
assert.equal(resourceCost(invalid.greaterThan.bauxite), false);
assert.equal(resourceCost(invalid.greaterThan.full), false);

assert.equal(resourceCost(invalid.nil.fuel), false);
assert.equal(resourceCost(invalid.nil.ammo), false);
assert.equal(resourceCost(invalid.nil.steel), false);
assert.equal(resourceCost(invalid.nil.bauxite), false);
assert.equal(resourceCost(invalid.nil.full), false);

console.log('[success]', 'function resourceCost(arr)');