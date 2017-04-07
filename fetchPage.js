var fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    HttpProxyAgent = require('http-proxy-agent'),
    util = require('./util/consoleUtil');

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

        // 根据当前的日期与小时, 生成唯一文件名前缀,
        //   暂时通过该土办法保存以往的改修记录
        path = './metaData/',

        // 在node shell下, new Date().toLocaleDateString()默认的分割符为'-',
        //   同样的函数生成的分隔符与其他js平台的运行结果可能不同
        //   sample - through [Chrome DevTools] is '/', i.e. "2017/1/21",
        //   sample - through [node.js]         is '-', i.e. '2017-01-21'
        todayStr = util.calcTodayStr(),
        fileName = 'kaisyu-table-fixed.html',
        fullPath = path + todayStr + fileName;

    var $ = cheerio.load(utf8html);

        // 获取改修表格
    var $kaisyuTable = $('#kaisyu').parent().next().next().find('table'),
        // 获取改修表主体内容
        $kaisyuTbody = $kaisyuTable.find('tbody'),
        removedCount = cleanInvalidTH($kaisyuTbody, $),
        // # refactoring #  尝试过使用wrap()的方式添加table, tbody, 结果不理想
        // # document #     https://github.com/cheeriojs/cheerio#wrap-content-
        // # risk #         字符串拼接可能会引起性能问题, 2017.02.05并没有看到
        entireTable = '<table><tbody>' + $kaisyuTbody.html()
                      + '</tbody></table>';

    // 保存表格到本地
    fs.writeFile(fullPath, entireTable, function(err) {

      if(err) {
        console.log('[ERROR]改修表格抓取失败');
      } else {
        console.log('页面抓取处理完毕。\n[存档路径]', fullPath);
        if(removedCount === 0) {
          console.log('表格未能抓取成功, 可能是页面结构改动');
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