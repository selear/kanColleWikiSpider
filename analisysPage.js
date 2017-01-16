var fs = require('fs'),
    cheerio = require('cheerio'),
    util = require('./consoleUtil'),
    $ = null;

var MODELS        = require('./model/kaisyu_table'),
    Category      = MODELS.Category,
    Equip         = MODELS.Equip,
    ImproveTarget = MODELS.ImproveTarget;

var STATIC = {
  DATA_SOURCE : 'kaisyu-table-fixed.html',
  TARGET_PATH : './analisysed/',
  TARGET_JSON : 'kaisyu-table-fixed.json'
};

fs.readFile(STATIC.DATA_SOURCE, { encoding: 'utf8' }, function(err, utf8html) {

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
          assist, remark;

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
      //                          [remark]
      //
      //    + $tds.length = 18  - [fuel, ammo, steel, bauxite]
      //                          [develop, improve, cost]
      //                          [sun, mon, tue, wed, thu, fri, sat, assist]
      //                          [remark]
      // TODO 编写一个数组, 如果出现不同于上述数量的tr, 抛出错误, 并给予提示
      var $tds = $curr.find('td');
      if($tds.first().find('a').length > 0) {
        var eName = $tds.first().text();
        equipNames.push(eName);

        currEquip = new Equip(eName);

        // 油弹钢铝 - 消耗
        // rCost --> resourceCost
        var rCost = Equip.initResourceCost($tds, [2, 3, 4, 5]);

        // 其他物资 - 消耗
        // iDetal --> improveDetail
        var iDetail = Equip.initImproveDetail($tds, [1, 6, 7, 8]);

        // Equip.
        if(iDetail.getPhase() === 0) {
          currImproveTarget = new ImproveTarget();
        }
        currImproveTarget.setResourceCost(rCost);

        currImproveTarget.getImproveCost().merge(iDetail);

        currEquip.addImproveTarget(currImproveTarget);

        // cheerio读取本地文件时, INDEX is ZERO BASED
        //MK7 + 六联装鱼雷 + 数种战斗机加入改修后, $tds.eq(9)在表格中, 有的是空节点, 有的不是, 因此通过.text().length来判断后续数据提取
        var idxArr = [10, 11, 12, 13, 14, 15, 16, 17],
            remarkIdx = 18,
            nodeLength = $tds.eq(9).text().length;
        if(nodeLength === 0) {
          //do nothing
        } else if(nodeLength === 1) {
          idxArr = idxArr.map(function(x) {
            return x - 1;
          });
          remarkIdx = remarkIdx - 1;
        } else {
          throw new Error('$tds.eq(9).text().length has some Error, equipName --> ' + eName);
        }

        currImproveTarget.addImproveAssist(Equip.initImproveAssist($tds, idxArr));

        currImproveTarget.setRemark($tds.eq(remarkIdx).text());

        currCategory.addEquip(currEquip);

      } else if($tds.length === 4) {

        var iDetail = Equip.initImproveDetail($tds, [0, 1, 2, 3]);
        currImproveTarget.getImproveCost().merge(iDetail);

        // length === 4时, 几乎确定不需要新的ImproveTarget实例, 因此一下代码理应永久不生效
        // if(phase === 0) {
        //   console.log('new Target @ $tds.length = 4 --> ' + currEquip.getEquipName());
        //   currImproveTarget = new ImproveTarget();
        // }

      } else if($tds.length === 8) {

        currImproveTarget.addImproveAssist(Equip.initImproveAssist($tds, [0, 1, 2, 3, 4, 5, 6, 7]));

      } else if($tds.length === 12) {

        var iDetail = Equip.initImproveDetail($tds, [0, 1, 2, 3]);
        currImproveTarget.getImproveCost().merge(iDetail);

        currImproveTarget.addImproveAssist(Equip.initImproveAssist($tds, [4, 5, 6, 7, 8, 9, 10, 11]));

        // length === 12时, 几乎确定不需要新的ImproveTarget实例, 因此一下代码理应永久不生效
        // if(phase === 0) {
        //   console.log('new Target @ $tds.length = 12 --> ' + currEquip.getEquipName());
        // }

      } else if($tds.length === 17) {
        // 17与18最主要的区别是在.eq(9)的位置是否存在不包含数据td标签
        // 与$tds.length === 19下包含的信息几乎相同, 需要新的ImproveTarget来存放信息
        var iDetail = Equip.initImproveDetail($tds, [0, 5, 6, 7]);
        if(iDetail.getPhase() === 0) {
          currImproveTarget = new ImproveTarget();

          currEquip.addImproveTarget(currImproveTarget);
          console.log('new Target @ $tds.length = 17 --> ' + currEquip.getEquipName());
        }
        currImproveTarget.getImproveCost().merge(iDetail);

        // 获取资源消耗并生成新的实例
        var rCost = Equip.initResourceCost($tds, [1, 2, 3, 4]);
        currImproveTarget.setResourceCost(rCost);

        currImproveTarget.addImproveAssist(Equip.initImproveAssist($tds, [8, 9, 10, 11, 12, 13, 14, 15]));

        currImproveTarget.setRemark($tds.eq(16).text());

      } else if($tds.length === 18) {

        var iDetail = Equip.initImproveDetail($tds, [0, 5, 6, 7]);
        if(iDetail.getPhase() === 0) {
          currImproveTarget = new ImproveTarget();

          currEquip.addImproveTarget(currImproveTarget);
          console.log('new Target @ $tds.length = 18 --> ' + currEquip.getEquipName());
        }
        currImproveTarget.getImproveCost().merge(iDetail);

        // 获取资源消耗并生成新的实例
        var rCost = Equip.initResourceCost($tds, [1, 2, 3, 4]);
        currImproveTarget.setResourceCost(rCost);

        currImproveTarget.addImproveAssist(Equip.initImproveAssist($tds, [9, 10, 11, 12, 13, 14, 15, 16]));

        currImproveTarget.setRemark($tds.eq(17).text());

      }

      if(countMap[$tds.length]) {
        var val = countMap[$tds.length] + 1;
        countMap[$tds.length] = val;
      } else {
        countMap[$tds.length] = 1;
        countMap[$tds.length + 'th'] = equipNames[equipNames.length - 1];
      }

    });

    var i = 0;
    var jsonContent = '';
    for(i = 0; i < categories.length; i++) {
      var category = categories[i];
      jsonContent = jsonContent + JSON.stringify(category, null, '') + '\n';      
    }

    var filename = util.calcTodayStr() + STATIC.TARGET_JSON;
    var fullPath = STATIC.TARGET_PATH + filename;
    fs.writeFile(fullPath, jsonContent, function(err) {
      console.log('[已保存] ', filename);
    });
    
    //console.log(countMap);
    //console.log(categories.join());
    //console.log(JSON.stringify(categories, null, '  '));
    console.log('可改修total : ' + equipNames.length);
    //console.log('间隔栏total : ' + fenceLength);

});