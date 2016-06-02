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

    var categories = [],
        currCategory = null,
        currEquip = null,
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
      //                          [sun, mon, tue, wed, thu, fri, sat]
      //                          [assist]
      //
      //    + $tds.length = 17  - [fuel, ammo, steel, bauxite]
      //                          [develop, improve, cost]
      //                          [sun, mon, tue, wed, thu, fri, sat]
      //                          [assist, remarks]
      //
      //    + $tds.length = 18  - [fuel, ammo, steel, bauxite]
      //                          [develop, improve, cost]
      //                          [sun, mon, tue, wed, thu, fri, sat]
      //                          [assist, remarks]
      // TODO 编写一个数组, 如果出现不同于上述数量的tr, 抛出错误, 并给予提示
      var $tds = $curr.find('td');
      if($tds.first().find('a').length > 0) {
        var eName = $tds.first().text();
        equipNames.push(eName);

        fuel = $tds.eq(3).text();
        ammo = $tds.eq(4).text();
        steel = $tds.eq(5).text();
        bauxite = $tds.eq(6).text();

        develop = $tds.eq(7).text();
        improve = $tds.eq(8).text();
        cost = $tds.eq(9).text();

        // cheerio在读取本地文件后, 忽略了原有结构中的第10个td(该td内没有文字);
        // 由此, 计数按顺序增加即可
        sun = ($tds.eq(10).text() === IMPROVABLE) ? true : false;
        mon = ($tds.eq(11).text() === IMPROVABLE) ? true : false;
        tue = ($tds.eq(12).text() === IMPROVABLE) ? true : false;
        wed = ($tds.eq(13).text() === IMPROVABLE) ? true : false;
        thu = ($tds.eq(14).text() === IMPROVABLE) ? true : false;
        fri = ($tds.eq(15).text() === IMPROVABLE) ? true : false;
        sat = ($tds.eq(16).text() === IMPROVABLE) ? true : false;

        assist = $tds.eq(17).text();
        remarks = $tds.eq(18).text();

        currCategory.addEquip(new Equip(eName));
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

    //console.log(categories.join());
    console.log(countMap);
    console.log('可改修total : ' + equipNames.length);
    console.log('间隔栏total : ' + fenceLength);
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

function Equip(eName) {
  this.name = eName;
}

Equip.prototype = {
  toString : function() {
    return this.name;
  }
}

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