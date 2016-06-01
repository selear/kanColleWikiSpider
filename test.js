// proxy编写
var HttpProxyAgent = require('http-proxy-agent'),
    localProxy = 'http://127.0.0.1:1080',
    agent = new HttpProxyAgent(localProxy);

// node模块需求
var request = require('request'),
    iconv = require('iconv-lite'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    Buffer = require('buffer').Buffer;

console.log('---------------------\n  Requesting TARGET\n---------------------');

request({
    uri: "http://wikiwiki.jp/kancolle/?%B2%FE%BD%A4%B9%A9%BE%B3",
    method: "GET",
    agent: agent,
    encoding: null, // encoding强制为null, 会返回Buffer, 而非utf-8解码后的页面, 后续使用iconv进行转码工作
    timeout: 10000,
}, function(err, res, body) {

    var iconv = require('iconv-lite'),
        decoded = iconv.decode(body, 'eucjp'),
        utf8html = iconv.encode(decoded, 'utf8');

    var $ = cheerio.load(utf8html);

    var $kaisyuTable = $('#kaisyu').parent().next().next().find('table'),
      $kaisyuTbody = $kaisyuTable.find('tbody');

    var categories = [],
        currCategory = null,
        equipNames = [],
        fenceLength = 0;

    $kaisyuTbody.find('tr').each(function() {

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

    //var kaisyuTable = '<table><tbody>' + $kaisyuTbody.html() + '</tbody></table>';
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