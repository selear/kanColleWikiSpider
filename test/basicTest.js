const should = require('should');
const validate = require('../util/validateUtil');

describe('ValidateUtil.assistShip(str, arr)', function() {

  let assistShip = validate.assistShip;

  let valid = {
    'blankStr' : '',
    'normalStr': 'NORMAL_STRING',
    'emptyArr' : [],
    'fullArr'  : [0, 1, 2, 3, 4, 5, 6]
  };

  context('VALID str, VALID arr', function() {
    it('only return TRUE', function() {
      assistShip(valid.blankStr, valid.emptyArr).should.be.true;
      assistShip(valid.blankStr, valid.fullArr).should.be.true;
      assistShip(valid.normalStr, valid.emptyArr).should.be.true;
      assistShip(valid.normalStr, valid.fullArr).should.be.true;
    });
  });

  // 测试变量在INVALID一侧，因此VALID侧参数只要使用合法合理参数即可，无需交叉测试
  context('INVALID params', function() {
    let invalid = {
      'zero'             : 0,
      'positiveInt'      : 10,
      'negativeInt'      : -10,
      'positiveFloat'    : 200.5674,
      'negativeFloat'    : -200.5674,
      'nan'              : Number.NaN,
      'positiveInfinity' : Number.POSITIVE_INFINITY,
      'negativeInfinity' : Number.NEGATIVE_INFINITY,
      'emptyArr'         : [],
      'nil'              : null,
      'obj'              : {},

      'elemFloat'     : [5.349, 0, 1, 2, 6],
      'elemStrInt'    : [0, 1, 2, 6, '5'],
      'elemStr'       : ['str content', 0, 1, 2, 6],
      'elemArrEmpty'  : [2, 4, [], 6, 1],
      'elemArrFull'   : [2, 4, 6, 1, [0, 2, 5]],
      'elemNull'      : [6, 2, 4, null, 0],

      'elemOverflow'  : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      'elemLT'        : [0, 1, 2, -5],
      'elemGT'        : [1000, 1, 2, 4, 5, 6]
    };

    context('INVALID str, VALID arr', function() {
      context('input - number', function() {
        it('only return FALSE', function() {
          assistShip(invalid.zero, valid.fullArr).should.be.false;
          assistShip(invalid.positiveInt, valid.fullArr).should.be.false;
          assistShip(invalid.negativeInt, valid.fullArr).should.be.false;
          assistShip(invalid.positiveFloat, valid.fullArr).should.be.false;
          assistShip(invalid.negativeFloat, valid.fullArr).should.be.false;
          assistShip(invalid.nan, valid.fullArr).should.be.false;
          assistShip(invalid.positiveInfinity, valid.fullArr).should.be.false;
          assistShip(invalid.negativeInfinity, valid.fullArr).should.be.false;
        });
      });

      context('input - array, null, obj', function() {
        it('only return FALSE', function() {
          assistShip(invalid.emptyArr, valid.fullArr).should.be.false;
          assistShip(invalid.nil, valid.fullArr).should.be.false;
          assistShip(invalid.obj, valid.fullArr).should.be.false;
        });
      });
    });

    context('VALID str, INVALID arr', function() {
      it('only return FALSE', function() {
        assistShip(valid.normalStr, invalid.elemFloat).should.be.false;
        assistShip(valid.normalStr, invalid.elemStrInt).should.be.false;
        assistShip(valid.normalStr, invalid.elemStr).should.be.false;
        assistShip(valid.normalStr, invalid.elemArrEmpty).should.be.false;
        assistShip(valid.normalStr, invalid.elemArrFull).should.be.false;
        assistShip(valid.normalStr, invalid.elemNull).should.be.false;
        assistShip(valid.normalStr, invalid.elemOverflow).should.be.false;
        assistShip(valid.normalStr, invalid.elemLT).should.be.false;
        assistShip(valid.normalStr, invalid.elemGT).should.be.false;
        assistShip(valid.normalStr, invalid.emptyArr).should.be.false;
      });
    });
  });
});

describe('ValidateUtil.resourceCost(arr)', function() {
  let resourceCost  = validate.resourceCost;

  context('VALID arr', function() {
    let valid = {
      'fuel'    : ['999', '0', '0', '0'],
      'ammo'    : ['0', '999', '0', '0'],
      'steel'   : ['0', '0', '999', '0'],
      'bauxite' : ['0', '0', '0', '999'],
      'zero'    : ['0', '0', '0', '0'],
      'full'    : ['999', '999', '999', '999']
    };

    it('only return TRUE', function() {
      resourceCost(valid.fuel).should.be.true;
      resourceCost(valid.ammo).should.be.true;
      resourceCost(valid.steel).should.be.true;
      resourceCost(valid.bauxite).should.be.true;
      resourceCost(valid.zero).should.be.true;
      resourceCost(valid.full).should.be.true;
    });
  });

  context('INVALID arr', function() {
    let invalid = {
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

    it('only return FALSE', function() {
      resourceCost(invalid.negative.fuel).should.be.false;
      resourceCost(invalid.negative.ammo).should.be.false;
      resourceCost(invalid.negative.steel).should.be.false;
      resourceCost(invalid.negative.bauxite).should.be.false;
      resourceCost(invalid.negative.full).should.be.false;

      resourceCost(invalid.floatNum.fuel).should.be.false;
      resourceCost(invalid.floatNum.ammo).should.be.false;
      resourceCost(invalid.floatNum.steel).should.be.false;
      resourceCost(invalid.floatNum.bauxite).should.be.false;
      resourceCost(invalid.floatNum.full).should.be.false;

      resourceCost(invalid.greaterThan.fuel).should.be.false;
      resourceCost(invalid.greaterThan.ammo).should.be.false;
      resourceCost(invalid.greaterThan.steel).should.be.false;
      resourceCost(invalid.greaterThan.bauxite).should.be.false;
      resourceCost(invalid.greaterThan.full).should.be.false;

      resourceCost(invalid.nil.fuel).should.be.false;
      resourceCost(invalid.nil.ammo).should.be.false;
      resourceCost(invalid.nil.steel).should.be.false;
      resourceCost(invalid.nil.bauxite).should.be.false;
      resourceCost(invalid.nil.full).should.be.false;
    });
  });
});

describe('ValidateUtil.improveDetail(arr)', function() {
  let improveDetail = validate.improveDetail;

  context('VALID arr', function() {
    let valid = {
      'firstElem' : {
        'case1' : [0, '1/1', '2/2', '3'],
        'case2' : [1, '1/1', '2/2', '3'],
        'case3' : [2, '1/1', '2/2', '3'],
      },
      'secondElem' : {
        'case1' : [0, '0/50',  '2/2', '3'],
        'case2' : [0, '99/50', '2/2', '3'],
        'case3' : [0, '50/1',  '2/2', '3'],
        'case4' : [0, '50/99', '2/2', '3'],
        'case5' : [0, '-/-',   '2/2', '3']
      },
      'thirdElem' : {
        'case1' : [0, '1/1', '0/50',  '3'],
        'case2' : [0, '1/1', '99/50', '3'],
        'case3' : [0, '1/1', '50/1',  '3'],
        'case4' : [0, '1/1', '50/99', '3'],
        'case5' : [0, '1/1', '-/-',   '3']
      },
      'fourthElem' : {
        'case1' : [0, '1/1', '2/2', '0' ],
        'case2' : [0, '1/1', '2/2', '9'],
        'case3' : [0, '1/1', '2/2', ''  ],
        'case4' : [0, '1/1', '2/2', '-' ]
      }
    };

    it('only return TRUE', function() {
      improveDetail(valid.firstElem.case1).should.be.true;
      improveDetail(valid.firstElem.case2).should.be.true;
      improveDetail(valid.firstElem.case3).should.be.true;

      improveDetail(valid.secondElem.case1).should.be.true;
      improveDetail(valid.secondElem.case2).should.be.true;
      improveDetail(valid.secondElem.case3).should.be.true;
      improveDetail(valid.secondElem.case4).should.be.true;
      improveDetail(valid.secondElem.case5).should.be.true;

      improveDetail(valid.thirdElem.case1).should.be.true;
      improveDetail(valid.thirdElem.case2).should.be.true;
      improveDetail(valid.thirdElem.case3).should.be.true;
      improveDetail(valid.thirdElem.case4).should.be.true;
      improveDetail(valid.thirdElem.case5).should.be.true;

      improveDetail(valid.fourthElem.case1).should.be.true;
      improveDetail(valid.fourthElem.case2).should.be.true;
      improveDetail(valid.fourthElem.case3).should.be.true;
      improveDetail(valid.fourthElem.case4).should.be.true;
    });
  });

  context('INVALID arr', function() {
    let invalid = {
      'LTlengthLimit' : [0, '1/1', '2/2'],
      'GTlengthLimit' : [0, '1/1', '2/2', '3', null],

      'notArray' : {
        'nil'     : null,
        'boolT'   : true,
        'boolF'   : false,
        'numInt'  : -1000,
        'numFloat': 1.2345,
        'string'  : 'String instead of Array.',
        'obj'     : {
          'testA' : 1,
          'testB' : -1.2,
          'testC' : [1, 2, 3],
          'testD' : 'testString'
        }
      },

      'firstElem' : {
        'nil'     : [null, '1/1', '2/2', '3/3'],
        'boolT'   : [true, '1/1', '2/2', '3/3'],
        'boolF'   : [false, '1/1', '2/2', '3/3'],
        'numFloat': [1.234567, '1/1', '2/2', '3/3'],
        'string'  : ['String instead of int', '1/1', '2/2', '3/3'],
        'array'   : [[], '1/1', '2/2', '3/3']
      },

      'secondElem' : {
        'nil'     : [0, null,  '2/2', '3'],
        'boolT'   : [1, true,  '2/2', '3'],
        'boolF'   : [1, false, '2/2', '3'],
        'numInt'  : [2, -1,    '2/2', '3'],
        'numFloat': [0, 5.67,  '2/2', '3'],
        'string'  : {
          'alphabet'  : [0, 'ab/cd', '2/2', '3'],
          'LTheadMin' : [1, '-1/1',  '2/2', '3'],
          'GTheadMax' : [2, '100/1', '2/2', '3'],
          'LTfootMin' : [0, '50/0',  '2/2', '3'],
          'GTfootMax' : [1, '50/100','2/2', '3']
        }
      },

      'thirdElem' : {
        'nil'     : [0, '1/1', null,  '3'],
        'boolT'   : [1, '1/1', true,  '3'],
        'boolF'   : [1, '1/1', false, '3'],
        'numInt'  : [2, '1/1', -1,    '3'],
        'numFloat': [0, '1/1', 5.67,  '3'],
        'string'  : {
          'alphabet'  : [1, '1/1', 'ab/cd', '3'],
          'LTheadMin' : [2, '1/1', '-1/1',  '3'],
          'GTheadMax' : [0, '1/1', '100/1', '3'],
          'LTfootMin' : [1, '1/1', '50/0',  '3'],
          'GTfootMax' : [2, '1/1', '50/100','3']
        }
      },

      'forthElem' : {
        'nil'     : [0, '1/1', '2/2', null],
        'boolT'   : [0, '1/1', '2/2', true],
        'boolF'   : [0, '1/1', '2/2', false],
        'numFloat': [0, '1/1', '2/2', 1.234],
        'string'  : [0, '1/1', '2/2', 'String'],
        'LTmin'   : [0, '1/1', '2/2', '-1'],
        'GTmax'   : [0, '1/1', '2/2', '10'],
      }
    };

    it('only return FALSE', function() {
      improveDetail(invalid.LTlengthLimit).should.be.false;
      improveDetail(invalid.GTlengthLimit).should.be.false;

      improveDetail(invalid.notArray.nil).should.be.false;
      improveDetail(invalid.notArray.boolT).should.be.false;
      improveDetail(invalid.notArray.boolF).should.be.false;
      improveDetail(invalid.notArray.numInt).should.be.false;
      improveDetail(invalid.notArray.numFloat).should.be.false;
      improveDetail(invalid.notArray.string).should.be.false;
      improveDetail(invalid.notArray.obj).should.be.false;

      improveDetail(invalid.firstElem.nil).should.be.false;
      improveDetail(invalid.firstElem.boolT).should.be.false;
      improveDetail(invalid.firstElem.boolF).should.be.false;
      improveDetail(invalid.firstElem.numFloat).should.be.false;
      improveDetail(invalid.firstElem.string).should.be.false;
      improveDetail(invalid.firstElem.array).should.be.false;

      improveDetail(invalid.secondElem.nil).should.be.false;
      improveDetail(invalid.secondElem.boolT).should.be.false;
      improveDetail(invalid.secondElem.boolF).should.be.false;
      improveDetail(invalid.secondElem.numInt).should.be.false;
      improveDetail(invalid.secondElem.numFloat).should.be.false;
      improveDetail(invalid.secondElem.string.alphabet).should.be.false;
      improveDetail(invalid.secondElem.string.LTheadMin).should.be.false;
      improveDetail(invalid.secondElem.string.GTheadMax).should.be.false;
      improveDetail(invalid.secondElem.string.LTfootMin).should.be.false;
      improveDetail(invalid.secondElem.string.GTfootMax).should.be.false;

      improveDetail(invalid.thirdElem.nil).should.be.false;
      improveDetail(invalid.thirdElem.boolT).should.be.false;
      improveDetail(invalid.thirdElem.boolF).should.be.false;
      improveDetail(invalid.thirdElem.numInt).should.be.false;
      improveDetail(invalid.thirdElem.numFloat).should.be.false;
      improveDetail(invalid.thirdElem.string.alphabet).should.be.false;
      improveDetail(invalid.thirdElem.string.LTheadMin).should.be.false;
      improveDetail(invalid.thirdElem.string.GTheadMax).should.be.false;
      improveDetail(invalid.thirdElem.string.LTfootMin).should.be.false;
      improveDetail(invalid.thirdElem.string.GTfootMax).should.be.false;

      improveDetail(invalid.forthElem.nil).should.be.false;
      improveDetail(invalid.forthElem.boolT).should.be.false;
      improveDetail(invalid.forthElem.boolF).should.be.false;
      improveDetail(invalid.forthElem.numFloat).should.be.false;
      improveDetail(invalid.forthElem.string).should.be.false;
      improveDetail(invalid.forthElem.LTmin).should.be.false;
      improveDetail(invalid.forthElem.GTmax).should.be.false;
    });
  });
});