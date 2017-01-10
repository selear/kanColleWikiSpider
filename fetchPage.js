var fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    HttpProxyAgent = require('http-proxy-agent'),
    util = require('./consoleUtil');

var shadowSocks = 'http://127.0.0.1:1080',
    agent = new HttpProxyAgent(shadowSocks);

util.banner('Requesting page --> [改修工廠]');

request({
  uri: "http://wikiwiki.jp/kancolle/?%B2%FE%BD%A4%B9%A9%BE%B3",
  method: "GET",
  agent: agent,
  encoding: null,
  timeout: 10000
}, function(error, response, body) {

  var categoryArr = [];

  if (error) {
    console.log(error);
  } else {

    var iconv = require('iconv-lite'),
        decoded = iconv.decode(body, 'eucjp'),
        utf8html = iconv.encode(decoded, 'utf8'),

        // 根据当前的日期与小时, 生成唯一文件名前缀, 暂时通过该土办法保存以往的改修记录
        path = './metaData/';
        todayStr = util.calcTodayStr(), //在node交互界面下, date默认的分割符为'-', 同样的函数生成的分隔符与其他js平台的运行结果可能不同(例如: runtime in chrome devTools下是'/')
        fileName = 'kaisyu-table-fixed.html',
        fullPath = path + todayStr + fileName;

    var $ = cheerio.load(utf8html);

    var $kaisyuTable = $('#kaisyu').parent().next().next().find('table'), //获取改修表格
        $kaisyuTbody = $kaisyuTable.find('tbody'), //获取改修表实体
        removedCount = cleanInvalidTH($kaisyuTbody, $),
        entireTable = '<table><tbody>' + $kaisyuTbody.html() + '</tbody></table>';

    // 表格保存到本地
    fs.writeFile(fullPath, entireTable, function(err) {

      if(err) {

        console.log('[ERROR]改修表格保存失败。');

      } else {

        console.log('页面抓取处理完毕。');
        if(removedCount === 0) {
          console.log('表格未能抓取成功，可能是页面结构改动');
        } else {
          console.log('移除间隔数 : ' + removedCount);
        }
        
      }
    });

  }
});

function cleanInvalidTH($tbody, $) {

  var removedCount = 0;

  $tbody.find('tr').each(function() {
    var $tr = $(this);
    if ($tr.find('th').length > 1) {
      $tr.remove();
      removedCount ++;
    }
  });

  return removedCount;
}