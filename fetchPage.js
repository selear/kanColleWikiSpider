var fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    HttpProxyAgent = require('http-proxy-agent');

var shadowSocks = 'http://127.0.0.1:1080',
    agent = new HttpProxyAgent(shadowSocks);



request({
  uri: "http://wikiwiki.jp/kancolle/?%B2%FE%BD%A4%B9%A9%BE%B3",
  method: "GET",
  agent: agent,
  encoding: null,
  timeout: 10000
}, function(error, response, body) {

  var categoryArr = [];

  if (!error) {

    var iconv = require('iconv-lite'),
        decoded = iconv.decode(body, 'eucjp'),
        utf8html = iconv.encode(decoded, 'utf8');

    var $ = cheerio.load(utf8html);

    //获取改修表格
    var $kaisyuTable = $('#kaisyu').parent().next().next().find('table'),
        //获取改修表实体
        $kaisyuTbody = $kaisyuTable.find('tbody');

    var fixedTable = '<table><tbody>' + $kaisyuTbody.html() + '</tbody></table>';

  }

  fs.writeFile('fixedKaisyu.html', fixedTable, function(err) {
    console.log('File successfully written! - Check your project directory for the output.html file');
  });

});

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