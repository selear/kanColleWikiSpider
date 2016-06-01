var fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    HttpProxyAgent = require('http-proxy-agent');

var shadowSocks = 'http://127.0.0.1:1080',
    agent = new HttpProxyAgent(shadowSocks);

banner('Requesting target webpage');

request({
  uri: "http://wikiwiki.jp/kancolle/?%B2%FE%BD%A4%B9%A9%BE%B3",
  method: "GET",
  agent: agent,
  encoding: null,
  timeout: 10000
}, function(error, response, body) {

  var categoryArr = [],
      removedTrs = 0;

  if (!error) {

    var iconv = require('iconv-lite'),
        decoded = iconv.decode(body, 'eucjp'),
        utf8html = iconv.encode(decoded, 'utf8');

    var $ = cheerio.load(utf8html);

    //获取改修表格
    var $kaisyuTable = $('#kaisyu').parent().next().next().find('table'),
        //获取改修表实体
        $kaisyuTbody = $kaisyuTable.find('tbody');

    cleanInvalidTH($kaisyuTbody);

    var fixedTable = '<table><tbody>' + $kaisyuTbody.html() + '</tbody></table>';

    function cleanInvalidTH($tbody) {
      $tbody.find('tr').each(function() {
        var $tr = $(this);
        if ($tr.find('th').length > 1) {
          $tr.remove();
          removedTrs++;
        }
      });
      return removedTrs;
    }
  }

  fs.writeFile('fixedKaisyu.html', fixedTable, function(err) {
    console.log('页面抓取处理完毕.');
    console.log('移除间隔数 : ' + removedTrs);
  });

});

function banner(bannerText) {
  var DELIMITER = '-',
      SPACES = 6;
      PRE_SPACES = SPACES/2 + 1;

  var bannerLen = bannerText.length,
      fullLen = SPACES + bannerLen + 1,
      lineGen = new Array(fullLen),
      line = lineGen.join(DELIMITER),
      fixed = new Array(PRE_SPACES).join(' ') + bannerText;

  console.log([line, fixed, line].join('\n'));
}