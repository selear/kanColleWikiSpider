// import PART
import fs from "fs";
import request from "request";
import cheerio from "cheerio";
import HttpsProxyAgent from "https-proxy-agent";
import iconvLite from "iconv-lite";

// 默认值 TODO 可以修改
const DICTIONARY_INDEX = ["KAISYU", "OTHERS"];
const DICTIONARY = new Map([
  ["KAISYU", "https://wikiwiki.jp/kancolle/%E6%94%B9%E4%BF%AE%E5%B7%A5%E5%BB%A0"],
  ["OTHERS", ""]
]);
const DEFAULT_OPT = {
  "debug": false,
  "url": DICTIONARY.get(DICTIONARY_INDEX[0])
};

let promise_fetchKaisyu = new Promise(function(resolve, reject) {

  const customOptions = {
    uri: 'http://wikiwiki.jp/kancolle/?%B2%FE%BD%A4%B9%A9%BE%B3',
    method: 'GET',
    agent: new HttpsProxyAgent('http://127.0.0.1:1080'),
    encoding: null,
    timeout: 10000
  };

  request(customOptions, function(error, response, body) {

    if(error) {
      reject('出现错误', error);
    } else {
      resolve(response, body);
    }
  });
});

promise_fetchKaisyu
  .then()
  .catch()
  .finally();

// 几种可能的error
/*
* + 连接成功
*   + 成功GET页面
*     + 找到指定内容
*     * 未找到指定内容
*       + 保存文件
*       * 保存文件失败
* * 连接超时
*
* + 连接成功
*   + 成功获取页面
*     + 找到指定内容
*     - 未找到指定内容
*   - 未成功获取页面
* - 连接失败
*   - 连接超时
*   - 代理问题
* */


const agent = new HttpsProxyAgent('http://127.0.0.1:1080');

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

    var decoded = iconvLite.decode(body, 'eucjp'),
      utf8html = iconvLite.encode(decoded, 'utf8'),

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


//////////
function fetchPage(opt) {

  if (!opt) throw new Error('参数opt属于null.');

  let connectTo = DEFAULT_OPT.url;
  if (opt.url) {
    connectTo = opt.url;
  }

  //进行连接
  connectTo;

};


function taskPackaged(opt) {
  fetchPage(opt);
}

export {
  taskPackaged as fetchPage,
  DICTIONARY_INDEX as INDEX
};