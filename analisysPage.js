var fs = require('fs'),
    cheerio = require('cheerio'),
    $ = null;

var STATIC = {
  TARGET_FILE : 'fixedKaisyu.html',
  IMPROVABLE : '〇',
  DISPROVABLE : '×'
};

fs.readFile(STATIC.TARGET_FILE, { encoding: 'utf8' }, function(err, utf8html) {

    if(err) throw err;
    $ = cheerio.load(utf8html);

    var $tbody = $('tbody');

    // TODO countMap目前用于统计每个tr的td, 可以在后续更新中用于新改修数据的校验
    // 如果数据不对就抛出异常
    var countMap = { };

    // TODO 可以考虑创建一个对象来将这些信息全数包含
    var categories = [],
        currCategory = null,
        currEquip = null,
        currImproveTarget = null,
        equipNames = [],
        fenceLength = 0;
    $tbody.find('tr').each(function() {

      var $curr = $(this);

      // 2016.05.24
      // 对各个类别来说：
      // 每个类别均包含category, 当tr中仅包含一个th时, 该th中包含了categoryName
      if($curr.find('th').length === 1) {
        var cName = $curr.find('th').text();

        currCategory = new Category(cName);
        categories.push(currCategory);
      } else if($curr.find('th').length > 1) {
        fenceLength++;
      }

      var sun, mon, tue, wed, thu, fri, sat,
          assist, remarks;

      // 2016.05.24
      // 每个装备的第一个td如果包含a, 则该td中包含了equipName, $tds.length = 19
      //    如果不包含, 分成多种情况:
      //    + $tds.length = 4   - [develop, improve, cost]
      //
      //    + $tds.length = 8   - [sun, mon, tue, wed, thu, fri, sat, assist]
      //
      //    + $tds.length = 12  - [develop, improve, cost]
      //                          [sun, mon, tue, wed, thu, fri, sat, assist]
      //
      //    + $tds.length = 17  - [fuel, ammo, steel, bauxite]
      //                          [develop, improve, cost]
      //                          [sun, mon, tue, wed, thu, fri, sat, assist]
      //                          [remarks]
      //
      //    + $tds.length = 18  - [fuel, ammo, steel, bauxite]
      //                          [develop, improve, cost]
      //                          [sun, mon, tue, wed, thu, fri, sat, assist]
      //                          [remarks]
      // TODO 编写一个数组, 如果出现不同于上述数量的tr, 抛出错误, 并给予提示
      var $tds = $curr.find('td');
      if($tds.first().find('a').length > 0) {
        var eName = $tds.first().text();
        equipNames.push(eName);

        currEquip = new Equip(eName);

        // 油弹钢铝 - 消耗
        // rCost --> resourceCost
        var rCost = ResourceCost.create($tds, [2, 3, 4, 5]);

        // 其他物资 - 消耗
        // iDetal --> improveDetail
        var iDetail = ImproveDetail.create($tds, [1, 6, 7, 8]);

        if(iDetail.getPhase() === 0) {
          currImproveTarget = new ImproveTarget();
        }
        currImproveTarget.setResourceCost(rCost);

        currImproveTarget.getImproveCost().merge(iDetail);

        currEquip.addImproveTarget(currImproveTarget);

        // cheerio读取本地文件时, INDEX is ZERO BASED, 忽略$tds.eq(9), 此td为空
        currImproveTarget.addImproveAssist(ImproveAssist.create($tds, [10, 11, 12, 13, 14, 15, 16, 17]));

        remarks = $tds.eq(18).text();

        currCategory.addEquip(currEquip);
      } else if($tds.length === 4) {

        var iDetail = ImproveDetail.create($tds, [0, 1, 2, 3]);
        currImproveTarget.getImproveCost().merge(iDetail);

        // length === 4时, 几乎确定不需要新的ImproveTarget实例, 因此一下代码理应永久不生效
        // if(phase === 0) {
        //   console.log('new Target @ $tds.length = 4 --> ' + currEquip.getEquipName());
        //   currImproveTarget = new ImproveTarget();
        // }

      } else if($tds.length === 8) {

        currImproveTarget.addImproveAssist(ImproveAssist.create($tds, [0, 1, 2, 3, 4, 5, 6, 7]));

      } else if($tds.length === 12) {

        var iDetail = ImproveDetail.create($tds, [0, 1, 2, 3]);
        currImproveTarget.getImproveCost().merge(iDetail);

        currImproveTarget.addImproveAssist(ImproveAssist.create($tds, [4, 5, 6, 7, 8, 9, 10, 11]));

        // length === 12时, 几乎确定不需要新的ImproveTarget实例, 因此一下代码理应永久不生效
        // if(phase === 0) {
        //   console.log('new Target @ $tds.length = 12 --> ' + currEquip.getEquipName());
        // }

      } else if($tds.length === 17) {
        // 17与18最主要的区别是在.eq(9)的位置是否有一个空td标签
        // 与$tds.length === 19下包含的信息几乎相同, 需要新的ImproveTarget来存放信息
        var iDetail = ImproveDetail.create($tds, [0, 5, 6, 7]);
        if(iDetail.getPhase() === 0) {
          currImproveTarget = new ImproveTarget();

          currEquip.addImproveTarget(currImproveTarget);
          console.log('new Target @ $tds.length = 17 --> ' + currEquip.getEquipName());
        }
        currImproveTarget.getImproveCost().merge(iDetail);

        // 获取资源消耗并生成新的实例
        var rCost = ResourceCost.create($tds, [1, 2, 3, 4]);
        currImproveTarget.setResourceCost(rCost);

        currImproveTarget.addImproveAssist(ImproveAssist.create($tds, [8, 9, 10, 11, 12, 13, 14, 15]));

      } else if($tds.length === 18) {

        var iDetail = ImproveDetail.create($tds, [0, 5, 6, 7]);
        if(iDetail.getPhase() === 0) {
          currImproveTarget = new ImproveTarget();

          currEquip.addImproveTarget(currImproveTarget);
          console.log('new Target @ $tds.length = 18 --> ' + currEquip.getEquipName());
        }
        currImproveTarget.getImproveCost().merge(iDetail);

        // 获取资源消耗并生成新的实例
        var rCost = ResourceCost.create($tds, [1, 2, 3, 4]);
        currImproveTarget.setResourceCost(rCost);

        currImproveTarget.addImproveAssist(ImproveAssist.create($tds, [9, 10, 11, 12, 13, 14, 15, 16]));

      }

      if(countMap[$tds.length]) {
        var val = countMap[$tds.length] + 1;
        countMap[$tds.length] = val;
      } else {
        countMap[$tds.length] = 1;
        countMap[$tds.length + 'th'] = equipNames[equipNames.length - 1];
      }

    });

    //console.log(countMap);
    console.log(categories.join());
    //console.log('可改修total : ' + equipNames.length);
    //console.log('间隔栏total : ' + fenceLength);
});

function Category(cName) {
  this.name = cName;
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
        result = this.name + '[' + this.countEquips() + ']' + '\n';
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
  toString : function() {
    return '\n     - ' + this.improveCost.toString()
            + '\n     - ' + this.resourceCost.toString()
            + '\n     - ' + this.improveAssist.join('\n     - ');
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

function ImproveDetail(phase, improve, develop, cost) {
  this.phase = phase
  this.cost = [improve, develop, cost]
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
  return new ImproveDetail(phase, improve, develop, cost);
};

ImproveDetail.prototype = {
  getPhase : function() {
    return this.phase;
  },
  toString : function() {
    return '[' + this.cost.join(', ') + ']';
  }
};

// Model - ResourceCost
function ResourceCost(fuel, ammo, steel, bauxite) {
  this.cost = [fuel, ammo, steel, bauxite];
}

ResourceCost.create = function($tds, idxArr) {
  var fuel = $tds.eq(idxArr[0]).text(),
      ammo = $tds.eq(idxArr[1]).text(),
      steel = $tds.eq(idxArr[2]).text(),
      bauxite = $tds.eq(idxArr[3]).text();

  return new ResourceCost(fuel, ammo, steel, bauxite);
};

ResourceCost.prototype = {
  toString : function() {
    return '[' + this.cost.join('\/') + ']';
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

function banner(bannerText) {
  var DELIMITER = '-',
      SPACES = 6;
      PRE_SPACES = SPACES/2 + 1;

  var bannerLen = bannerText.length,
      fullLen = SPACES + bannerLen,
      lineGen = new Array(fullLen),
      line = lineGen.join(DELIMITER),
      fixed = new Array(PRE_SPACES).join(' ') + bannerText;

  console.log([line, fixed, line].join('\n'));
}