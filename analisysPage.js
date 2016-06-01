var fs = require('fs'),
    cheerio = require('cheerio'),
    $ = null;

var TARGET_FILE = 'fixedKaisyu.html';

fs.readFile(TARGET_FILE, { encoding: 'utf8'}, function(err, utf8html) {
    if(err) throw err;
    $ = cheerio.load(utf8html);

    var $tbody = $('tbody');

    var categories = [],
        currCategory = null,
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

      // 2016.05.24
      // 对于每个装备
      // 每个装备的第一个td如果包含a, 则该td中包含了equipName
      if($curr.find('td').first().find('a').length > 0) {
        var eName = $curr.find('td').first().text();
        equipNames.push(eName);

        currCategory.addEquip(new Equip(eName));
      }

    });

    console.log(categories.join());
    //console.log(equipNames.join(',\n'));
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
  toString : function() {
    var keys = Object.keys(this.equipArr),
        result = this.name + '\n';
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

function delimit(title) {
  var DELIMITER = '-',
      SPACES = 6;
      PRE_SPACES = SPACES/2 + 1;

  var titleLen = title.length,
      fixedTitle = new Array(PRE_SPACES).join(' ') + title, 
      delimiterLen = titleLen + SPACES,
      lineArr = new Array(delimiterLen),
      line = lineArr.join(DELIMITER);

  console.log([line, fixedTitle, line].join('\n'));
}