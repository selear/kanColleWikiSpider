var fs = require('fs'),
    cheerio = require('cheerio'),
    $ = null;

var TARGET_FILE = 'fixedKaisyu.html',
    IMPROVABLE = '〇',
    DISPROVABLE = '×';

fs.readFile(TARGET_FILE, { encoding: 'utf8'}, function(err, utf8html) {

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

      var fuel, ammo, steel, bauxite,
          develop, improve, cost,
          sun, mon, tue, wed, thu, fri, sat,
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

        // 油弹钢铝
        fuel = $tds.eq(2).text();
        ammo = $tds.eq(3).text();
        steel = $tds.eq(4).text();
        bauxite = $tds.eq(5).text();
        var rCost = new ResourceCost(fuel, ammo, steel, bauxite);

        // 改修消耗
        var phaseStr = $tds.eq(1).text();
        develop = $tds.eq(6).text();
        improve = $tds.eq(7).text();
        cost = $tds.eq(8).text();
        
        var phase = ImproveDetail.whichPhase(phaseStr);
        if(phase === 0) {
          currImproveTarget = new ImproveTarget();
          currImproveTarget.setResourceCost(rCost);
        }
        var iCost = new ImproveCost();
        iCost.merge(new ImproveDetail(phase, develop, improve, cost));

        currImproveTarget.setImproveCost(iCost);
        currEquip.addImproveTarget(currImproveTarget);

        // cheerio在读取本地文件时, index是zero based, 忽略.eq(9), 此td为空
        sun = ($tds.eq(10).text() === IMPROVABLE) ? true : false;
        mon = ($tds.eq(11).text() === IMPROVABLE) ? true : false;
        tue = ($tds.eq(12).text() === IMPROVABLE) ? true : false;
        wed = ($tds.eq(13).text() === IMPROVABLE) ? true : false;
        thu = ($tds.eq(14).text() === IMPROVABLE) ? true : false;
        fri = ($tds.eq(15).text() === IMPROVABLE) ? true : false;
        sat = ($tds.eq(16).text() === IMPROVABLE) ? true : false;

        assist = $tds.eq(17).text();
        remarks = $tds.eq(18).text();

        currCategory.addEquip(currEquip);
      } else if($tds.length === 4) {

        var phaseStr = $tds.eq(0).text();
        develop = $tds.eq(1).text();
        improve = $tds.eq(2).text();
        cost = $tds.eq(3).text();
        
        var phase = ImproveDetail.whichPhase(phaseStr);
        currImproveTarget.getImproveCost().merge(new ImproveDetail(phase, develop, improve, cost));

        // length === 4时, 几乎确定不需要新的ImproveTarget实例, 因此一下代码理应永久不生效
        // if(phase === 0) {
        //   console.log('new Target @ $tds.length = 4 --> ' + currEquip.getEquipName());
        //   currImproveTarget = new ImproveTarget();
        // }

      } else if($tds.length === 8) {

      } else if($tds.length === 12) {

        var phaseStr = $tds.eq(0).text();
        develop = $tds.eq(1).text();
        improve = $tds.eq(2).text();
        cost = $tds.eq(3).text();
        
        var phase = ImproveDetail.whichPhase(phaseStr);
        currImproveTarget.getImproveCost().merge(new ImproveDetail(phase, develop, improve, cost));

        // length === 12时, 几乎确定不需要新的ImproveTarget实例, 因此一下代码理应永久不生效
        // if(phase === 0) {
        //   console.log('new Target @ $tds.length = 12 --> ' + currEquip.getEquipName());
        // }

      } else if($tds.length === 17) {
        // 17与18最主要的区别是在.eq(9)的位置是否有一个空td标签
        // 与$tds.length === 19下包含的信息几乎相同, 需要新的ImproveTarget来存放信息
        var phaseStr = $tds.eq(0).text();
        develop = $tds.eq(5).text();
        improve = $tds.eq(6).text();
        cost = $tds.eq(7).text();
        
        var phase = ImproveDetail.whichPhase(phaseStr);
        if(phase === 0) {
          currImproveTarget = new ImproveTarget();
          currImproveTarget.setImproveCost(new ImproveCost());

          currEquip.addImproveTarget(currImproveTarget);
          console.log('new Target @ $tds.length = 17 --> ' + currEquip.getEquipName());
        }

        // 获取资源消耗并生成新的实例
        fuel = $tds.eq(1).text();
        ammo = $tds.eq(2).text()
        steel = $tds.eq(3).text();
        bauxite = $tds.eq(4).text();
        var rCost = new ResourceCost(fuel, ammo, steel, bauxite);
        currImproveTarget.setResourceCost(rCost);

        currImproveTarget.getImproveCost().merge(new ImproveDetail(phase, develop, improve, cost));

      } else if($tds.length === 18) {

        var phaseStr = $tds.eq(0).text();
        develop = $tds.eq(5).text();
        improve = $tds.eq(6).text();
        cost = $tds.eq(7).text();
        
        var phase = ImproveDetail.whichPhase(phaseStr);
        if(phase === 0) {
          currImproveTarget = new ImproveTarget();
          currImproveTarget.setImproveCost(new ImproveCost());

          currEquip.addImproveTarget(currImproveTarget);
          console.log('new Target @ $tds.length = 18 --> ' + currEquip.getEquipName());
        }

        // 获取资源消耗并生成新的实例
        fuel = $tds.eq(1).text();
        ammo = $tds.eq(2).text()
        steel = $tds.eq(3).text();
        bauxite = $tds.eq(4).text();
        var rCost = new ResourceCost(fuel, ammo, steel, bauxite);
        currImproveTarget.setResourceCost(rCost);

        currImproveTarget.getImproveCost().merge(new ImproveDetail(phase, develop, improve, cost));
      }

      if(countMap[$tds.length]) {
        var val = countMap[$tds.length] + 1;
        countMap[$tds.length] = val;
      } else {
        countMap[$tds.length] = 1;
        countMap[$tds.length + 'th'] = equipNames[equipNames.length - 1];
      }

      // else if($tds.length === 4) {
      //   console.log(4);
      // } else if($tds.length === 8) {
      //   console.log(8);
      // } else if($tds.length === 12) {
      //   console.log(12)
      // } else if($tds.length === 18) {
      //   console.log(18)
      // } else {
      //   console.log($tds.length);
      // }

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
  this.improveCost = null;
  this.resourceCost = null;
}

ImproveTarget.prototype = {
  setImproveCost : function(iCost) {
    if(iCost instanceof ImproveCost)
      this.improveCost = iCost;
    else
      throw new Error();
  },
  getImproveCost : function() {
    return this.improveCost;
  },
  setResourceCost : function(rCost) {
    if(rCost instanceof ResourceCost)
      this.resourceCost = rCost;
    else
      throw new Error();
  },
  toString : function() {
    return '\n     - ' + this.improveCost.toString() + '\n     - ' + this.resourceCost.toString();
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
  var phaseStr = $tds.eq(idxArr[0]),
      develop = $tds.eq(idxArr[1]),
      improve = $tds.eq(idxArr[2]),
      cost = $tds.eq(idxArr[3]);

  var phase = Improve
};

ImproveDetail.prototype = {
  toString : function() {
    return '[' + this.cost.join(', ') + ']';
  }
};

// Model - ResourceCost
function ResourceCost(fuel, ammo, steel, bauxite) {
  this.cost = [fuel, ammo, steel, bauxite];
}

ResourceCost.prototype = {
  toString : function() {
    return '[' + this.cost.join('\/') + ']';
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

