var Category = function(cName) {
  if(this instanceof Category) {
    this.cName = cName;
    this.equipArr = [];
  } else {
    return new Category(cName);
  }
};

Category.prototype = {

  addEquip : function(equip) {
    this.equipArr.push(equip);
  },
  countEquips : function() {
    return this.equipArr.length;
  },
  toString : function() {
    var keys = Object.keys(this.equipArr),
        result = this.cName + '[' + this.countEquips() + ']' + '\n';
    for(var i = 0, len = keys.length; i < len; i++) {
      result += '  + ' + this.equipArr[keys[i]] + '\n';
    }
    return result;
  }
};

// Model - Equip
// 代表某项装备, 其下具有诸多属性:
// + String name
// + ImproveTarget
var Equip = function(eName) {
  if(this instanceof Equip) {
    this.name = eName;
    this.improveTarget = [];
  } else {
    return new Equip(eName);
  }
};

Equip.prototype = {

  addImproveTarget : function(tar) {
    if(tar instanceof ImproveTarget)
      this.improveTarget.push(tar);
    else
      throw new Error('incorrect type, input instanceof ImproveTarget');
  },
  getEquipName : function() {
    return this.name;
  },
  toString : function() {
    return this.name + this.improveTarget.toString();
  }
};

Equip.initResourceCost = function($tds, idxArr) {

  var fuel = $tds.eq(idxArr[0]).text(),
      ammo = $tds.eq(idxArr[1]).text(),
      steel = $tds.eq(idxArr[2]).text(),
      bauxite = $tds.eq(idxArr[3]).text();

  return new ResourceCost([fuel, ammo, steel, bauxite]);
};

Equip.initImproveDetail = function($tds, idxArr) {

  var phaseStr = $tds.eq(idxArr[0]).text(),
      phase = ImproveDetail.whichPhase(phaseStr),
      develop = $tds.eq(idxArr[1]).text(),
      improve = $tds.eq(idxArr[2]).text(),
      cost = $tds.eq(idxArr[3]).text();

  return new ImproveDetail([phase, develop, improve, cost]);
};

Equip.initImproveAssist = function($tds, idxArr) {

  if(idxArr.length != 8)
    throw new Error('indexArray.length NOT equal to 8');

  var assist = $tds.eq(idxArr.pop()).text(),
      enableDays = [];

  idxArr.forEach(function(elem, idx) {
    if($tds.eq(elem).text() === ImproveAssist.ENABLE)
      enableDays.push(idx);
  });

  return new ImproveAssist(assist, enableDays);
};

// Model - ImproveTarget
// 代表改修装备的方向
var ImproveTarget = function() {
  this.improveCost = new ImproveCost();
  this.resourceCost = null;
  this.improveAssist = [];
  this.remark = null;
};

ImproveTarget.prototype = {

  getImproveCost : function() {
    return this.improveCost;
  },
  setResourceCost : function(rCost) {
    if(rCost instanceof ResourceCost)
      this.resourceCost = rCost;
    else
      throw new Error('incorrect type, input instance of ResourceCost');
  },
  addImproveAssist : function(assistShips) {
    if(assistShips instanceof ImproveAssist)
      this.improveAssist.push(assistShips);
    else
      throw new Error('incorrect type, input instance of ImproveAssist');
  },
  setRemark : function(remark) {
    this.remark = remark || '[ Remark data NOT FOUND here ]';
  },
  toString : function() {
    return '\n     - ' + this.improveCost.toString()
            + '\n     - ' + this.resourceCost.toString()
            + '\n     - ' + this.improveAssist.join('\n     - ')
            + '\n     > ' + this.remark;
  }
};

// Model - ImproveCost
// 改修消耗
var ImproveCost = function() {
  this.cost = [];
};

ImproveCost.prototype = {

  merge : function(detail) {
    if(detail instanceof ImproveDetail)
      this.cost[detail.phase] = detail;
    else
      throw new Error('incorrect type, input instanceof ImproveDetail');
  },
  toString : function() {
    return this.cost.join();
  }
};

const validate = require('../util/validateUtil');

// Model - ImproveDetail
var ImproveDetail = function(dataArr) {
  if(this instanceof ImproveDetail) {
    this.phase = dataArr[0];
    this.develop = dataArr[1];
    this.improve = dataArr[2];
    this.equipCost = dataArr[3];  
  } else {
    return new ImproveDetail(dataArr);    
  }
};

ImproveDetail.whichPhase = function(phaseStr) {

  switch(phaseStr) {
    case '初期':
      return 0;
      break;
    case '★6':
      return 1;
      break;
    case '★max':
      return 2;
      break;
    default:
      throw new Error('[Error phaseStr]' + phaseStr);
      break;
  }
};

ImproveDetail.prototype = {

  getPhase : function() {
    return this.phase;
  },
  toArray : function() {
    return [this.phase, this.develop, this.improve, this.equipCost];
  },
  toString : function() {
    return '[' + this.toArray().join(', ') + ']';
  },
  isValid : function() {
    var input = [this.phase, this.develop, this.improve, this.equipCost];
    return validate.improveDetail(input);
  }
};

// Model - ResourceCost
var ResourceCost = function(dataArr) {
  if(this instanceof ResourceCost) {
    this.fuel = dataArr[0];
    this.ammo = dataArr[1];
    this.steel = dataArr[2];
    this.bauxite = dataArr[3];  
  } else {
    return new ResourceCost(dataArr);
  }
};

ResourceCost.prototype = {

  toArray : function() {
    return [this.fuel, this.ammo, this.steel, this.bauxite];
  },
  toString : function() {
    return '[' + this.toArray().join('\/') + ']';
  },
  isValid : function() {
    var input = [this.fuel, this.ammo, this.steel, this.bauxite];
    return validate.resourceCost(input);
  }
};

/*
    类ImproveAssist - 设计思路
    + String name
    + Array  enableDays
      sample [0, 1, 2, 3, 4, 5, 6], or [2, 3, 6, 0] etc.
      enableDays曾考虑使用单独对象表示, 数据结构如下:
        ImprovableWeekdays {
          SUN: false,
          MON: false,
          TUE: false,
          WED: false,
          THU: false,
          FRI: false,
          SAT: false
        }
        instance.update(index, true/false)
        instance.canImprove(weekday)
      但老数据结构仅在更新时相对不方便
      利用Array.prototype.indexOf(val) != -1的方式判断某天是否能够改修

    - Boolean isValid - 默认值false为防御性编程, 可以进一步精简
 */
var ImproveAssist = function(assistShip, enableDays) {
  if(this instanceof ImproveAssist) {
    this.name = assistShip;
    this.enableDays = enableDays;
  } else {
    return new ImproveAssist(assistShip, enableDays);
  }
};

ImproveAssist.ENABLE = '〇';
ImproveAssist.DISABLE = '×';

ImproveAssist.prototype = {

  contains : function(weekday) {
    var intVal = parseInt(weekday, 10);
    if(intVal != NaN)
      if(intVal >= 0 && intVal <= 6)
        return (this.enableDays.indexOf(intVal) != -1 ? true : false);
  },
  canImprove : function(weekday) {
    return this.contains(weekday);
  },
  merge : function(weekday) {
    if(!this.contains(weekday))
      this.enableDays.push(weekday);
  },
  toString : function() {
    return '< ' + this.name + ' > [' + this.enableDays.join() + ']';
  },
  isValid : function() {
    return validate.assistShip(this.name, this.enableDays);
  }
};

exports.Category      = Category;
exports.Equip         = Equip;
exports.ImproveTarget = ImproveTarget;