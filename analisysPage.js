var fs = require('fs'),
    cheerio = require('cheerio'),
    util = require('./util/consoleUtil'),
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
        curCategory = null,
        curEquip = null,
        curImproveTar = null,
        equipNames = [],
        fenceLength = 0;

    $tbody.find('tr').each(function() {

      var $curr = $(this);

      // 对各个类别来说, 每个类别均包含category,
      //   当tr中仅包含一个th时, 该th中包含了categoryName
      if($curr.find('th').length === 1) {
        var cName = $curr.find('th').text();

        curCategory = new Category(cName);
        categories.push(curCategory);
      } else if($curr.find('th').length > 1) {
        fenceLength++;
      }

      var sun, mon, tue, wed, thu, fri, sat,
          assist, remark;

      // 每个装备的第一个td如果包含<a>, 则该td包含了equipName, $tds.length = 19
      //   如果不包含, 分成多种情况:
      //   + $tds.length = 4   - [develop, improve, cost]
      //
      //   + $tds.length = 8   - [sun, mon, tue, wed, thu, fri, sat, assist]
      //
      //   + $tds.length = 12  - [develop, improve, cost]
      //                         [sun, mon, tue, wed, thu, fri, sat, assist]
      //
      //   + $tds.length = 17  - [fuel, ammo, steel, bauxite]
      //                         [develop, improve, cost]
      //                         [sun, mon, tue, wed, thu, fri, sat, assist]
      //                         [remark]
      //
      //   + $tds.length = 18  - [fuel, ammo, steel, bauxite]
      //                         [develop, improve, cost]
      //                         [sun, mon, tue, wed, thu, fri, sat, assist]
      //                         [remark]
      // TODO 编写一个数组, 如果出现不同于上述数量的tr, 抛出错误, 并给予提示
      var $tds = $curr.find('td');
      if($tds.first().find('a').length > 0) {
        var eName = $tds.first().text();
        equipNames.push(eName);

        curEquip = new Equip(eName);

            // resourceIdx --> fuel & ammo & steel & bauxite
            //                 燃料 & 弹药 & 钢材  & 铝土
        var resourceIdx = [2, 3, 4, 5],
            // rCost --> resourceCost
            rCost       = Equip.initResourceCost($tds, resourceIdx),

            // improveIdx -->    phase & develop  & improve  & cost
            //                改修阶段 & 开发资财 & 改修资财 & 装备消耗
            improveIdx = [1, 6, 7, 8],
            // iDetail --> improveDetail
            iDetail    = Equip.initImproveDetail($tds, improveIdx);

        if(iDetail.getPhase() === 0) {
          curImproveTar = new ImproveTarget();
        }
        curImproveTar.setResourceCost(rCost);

        curImproveTar.getImproveCost().merge(iDetail);

        curEquip.addImproveTarget(curImproveTar);

        /* cheerio读取本地文件时, INDEX is ZERO BASED
         * MK7 + 六联装鱼雷 + 数种战斗机加入改修后,
         *   $tds.eq(9)在表格中, 有的是空节点, 有的不是,
         *   由此通过.text().length判断, 并对提取后续数据
         */
            // daysIdx -->     enableDays & assistant,
            //             能够改修的日期 & 辅助舰娘
        var daysIdx = [10, 11, 12, 13, 14, 15, 16, 17],
            remarkIdx = 18,
            nodeLength = $tds.eq(9).text().length;
        
        if(nodeLength === 0) {
          // DO NOTHING
        } else if(nodeLength === 1) {
          daysIdx = daysIdx.map(function(x) {
            return x - 1;
          });
          remarkIdx = remarkIdx - 1;
        } else {
          throw new Error('$tds.eq(9) length has ERROR, [equipName]' + eName);
        }

        curImproveTar.addImproveAssist(Equip.initImproveAssist($tds, daysIdx));

        curImproveTar.setRemark($tds.eq(remarkIdx).text());

        curCategory.addEquip(curEquip);

      } else if($tds.length === 4) {

        var improveIdx = [0, 1, 2, 3],
            iDetail    = Equip.initImproveDetail($tds, improveIdx);

        curImproveTar.getImproveCost().merge(iDetail);

        // length === 4时, 几乎确定不需要创建ImproveTarget实例,
        //   由此以下代码应永久不生效
        // if(phase === 0) {
        //   console.log('new Target @ $tds.length = 4 --> '
        //               + curEquip.getEquipName());
        //   curImproveTar = new ImproveTarget();
        // }

      } else if($tds.length === 8) {

        var daysIdx = [0, 1, 2, 3, 4, 5, 6, 7];

        curImproveTar.addImproveAssist(Equip.initImproveAssist($tds, daysIdx));

      } else if($tds.length === 12) {

        var improveIdx = [0, 1, 2, 3],
            daysIdx    = [4, 5, 6, 7, 8, 9, 10, 11],
            iDetail    = Equip.initImproveDetail($tds, improveIdx);

        curImproveTar.getImproveCost().merge(iDetail);

        curImproveTar.addImproveAssist(Equip.initImproveAssist($tds, daysIdx));

        // length === 12时, 几乎确定不需要创建ImproveTarget实例,
        //   由此以下代码应永久不生效
        // if(phase === 0) {
        //   console.log('new Target @ $tds.length = 12 --> '
        //               + curEquip.getEquipName());
        // }

      } else if($tds.length === 17) {
        /* 17与18最主要的区别是在.eq(9)的位置是否存在空的td标签,
         *   以上两者与$tds.length === 19下包含的信息几乎相同,
         *   需要创建新的ImproveTarget实例存放信息
         */

        var improveIdx = [0, 5, 6, 7],
            iDetail    = Equip.initImproveDetail($tds, improveIdx);

        if(iDetail.getPhase() === 0) {
          curImproveTar = new ImproveTarget();
          curEquip.addImproveTarget(curImproveTar);
          console.log('new Target @ $tds.length = 17 --> '
                      + curEquip.getEquipName());
        }
        curImproveTar.getImproveCost().merge(iDetail);

        var resourceIdx = [1, 2, 3, 4],
            daysIdx     = [8, 9, 10, 11, 12, 13, 14, 15],
            rCost       = Equip.initResourceCost($tds, resourceIdx);

        curImproveTar.setResourceCost(rCost);

        curImproveTar.addImproveAssist(Equip.initImproveAssist($tds, daysIdx));

        curImproveTar.setRemark($tds.eq(16).text());

      } else if($tds.length === 18) {

        var improveIdx = [0, 5, 6, 7],
            iDetail    = Equip.initImproveDetail($tds, improveIdx);

        if(iDetail.getPhase() === 0) {

          curImproveTar = new ImproveTarget();
          curEquip.addImproveTarget(curImproveTar);
          console.log('new Target @ $tds.length = 18 --> '
                      + curEquip.getEquipName());

        }
        curImproveTar.getImproveCost().merge(iDetail);

        var resourceIdx = [1, 2, 3, 4],
            daysIdx     = [9, 10, 11, 12, 13, 14, 15, 16],
            rCost       = Equip.initResourceCost($tds, resourceIdx);

        curImproveTar.setResourceCost(rCost);

        curImproveTar.addImproveAssist(Equip.initImproveAssist($tds, daysIdx));

        curImproveTar.setRemark($tds.eq(17).text());

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

    var filename = util.calcTodayStr() + STATIC.TARGET_JSON,
        fullPath = STATIC.TARGET_PATH + filename;

    fs.writeFile(fullPath, jsonContent, function(err) {
      console.log('[已保存]', filename);
    });
    
    //console.log(countMap);
    //console.log(categories.join());
    //console.log(JSON.stringify(categories, null, '  '));
    console.log('可改修共计 : ', equipNames.length);
    //console.log('间隔栏total : ' + fenceLength);

});