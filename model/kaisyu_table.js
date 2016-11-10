function Category(cName) {
  this.cName = cName;
  this.equipArr = [];
}

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
}

// Model - Equip
// 代表某项装备, 其下具有诸多属性:
// + String name
// + ImproveTarget
function Equip(eName) {
  this.name = eName;
  this.improveTarget = [];
}

Equip.prototype = {
  addImproveTarget : function(tar) {
    if(tar instanceof ImproveTarget)
      this.improveTarget.push(tar);
    else
      throw new Error();
  },
  getEquipName : function() {
    return this.name;
  },
  toString : function() {
    return this.name + this.improveTarget.toString();
  }
}

// Model - ImproveTarget
// 代表改修装备的方向
// + ImproveCost improveCost
// + ResourceCost resourceCost
// + AssistShip assistShip
function ImproveTarget() {
  this.improveCost = new ImproveCost();
  this.resourceCost = null;
  this.improveAssist = [];
  this.remark = null;
}

ImproveTarget.prototype = {
  getImproveCost : function() {
    return this.improveCost;
  },
  setResourceCost : function(rCost) {
    if(rCost instanceof ResourceCost)
      this.resourceCost = rCost;
    else
      throw new Error();
  },
  addImproveAssist : function(assistShips) {
    if(assistShips instanceof ImproveAssist)
      this.improveAssist.push(assistShips);
    else
      throw new Error();
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
function ImproveCost() {
  this.cost = [];
}

ImproveCost.prototype = {
  merge : function(detail) {
    if(detail instanceof ImproveDetail)
      this.cost[detail.phase] = detail;
    else
      throw new Error();
  },
  toString : function() {
    return this.cost.join();
  }
};

function ImproveDetail(dataArr) {
  this.phase = dataArr[0];
  this.develop = dataArr[1];
  this.improve = dataArr[2];
  this.equipCost = dataArr[3];
}

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
      throw new Error(phaseStr);
      break;
  }
};

ImproveDetail.create = function($tds, idxArr) {
  var phaseStr = $tds.eq(idxArr[0]).text(),
      develop = $tds.eq(idxArr[1]).text(),
      improve = $tds.eq(idxArr[2]).text(),
      cost = $tds.eq(idxArr[3]).text();

  var phase = ImproveDetail.whichPhase(phaseStr);
  return new ImproveDetail([phase, develop, improve, cost]);
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
  }
};

// Model - ResourceCost
function ResourceCost(dataArr) {
  this.fuel = dataArr[0];
  this.ammo = dataArr[1];
  this.steel = dataArr[2];
  this.bauxite = dataArr[3];
}

ResourceCost.create = function($tds, idxArr) {
  var fuel = $tds.eq(idxArr[0]).text(),
      ammo = $tds.eq(idxArr[1]).text(),
      steel = $tds.eq(idxArr[2]).text(),
      bauxite = $tds.eq(idxArr[3]).text();

  return new ResourceCost([fuel, ammo, steel, bauxite]);
};

ResourceCost.prototype = {
  toArray : function() {
    return [this.fuel, this.ammo, this.steel, this.bauxite];
  },
  toString : function() {
    return '[' + this.toArray().join('\/') + ']';
  }
};

/*
    类ImproveAssist - 设计思路
    - String name
    - Array  improvableDays
      sample [0, 1, 2, 3, 4, 5, 6], or [2, 3, 6, 0] etc.
      improvableDays曾考虑使用单独类表示, 数据结构如下:
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
      个人认为使用native code能够提升效率
 */
function ImproveAssist(assistName, enableDays) {
  this.name = assistName;
  this.improvableDays = enableDays;
}

ImproveAssist.create = function($tds, idxArr) {

  if(idxArr.length != 8)
    throw new Error();

  var assist,
      enableDays = [];

  assist = $tds.eq(idxArr.pop()).text();

  idxArr.forEach(function(elem, idx) {
    if($tds.eq(elem).text() === STATIC.IMPROVABLE)
      enableDays.push(idx);
  });

  return new ImproveAssist(assist, enableDays);
};

ImproveAssist.prototype = {
  contains : function(weekday) {
    var intVal = parseInt(weekday, 10);
    if(intVal != NaN)
      if(intVal >= 0 && intVal <= 6)
        return (this.improvableDays.indexOf(intVal) != -1 ? true : false);
  },
  canImprove : function(weekday) {
    return this.contains(weekday);
  },
  merge : function(weekday) {
    if(!this.contains(weekday))
      this.improvableDays.push(weekday);
  },
  toString : function() {
    return '< ' + this.name + ' > [' + this.improvableDays.join() + ']';
  }
};