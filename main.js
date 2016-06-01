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

    //$cleaned = cleanInvalidTH($kaisyuTbody);
    //analyseTable($cleaned.clone());

    var kaisyuTable = '<table><tbody>' + $kaisyuTbody.html() + '</tbody></table>';

    function cleanInvalidTH($tbody) {

      var removedTrs = 0;
      $tbody.find('tr').each(function() {
        var $tr = $(this);
        if ($tr.find('th').length > 1) {
          $tr.remove();
          removedTrs++;
        }
      });

      console.log('tr remains [after] ---------> ' + $tbody.find('tr').length);
      console.log('tr totally removed ---------> ' + removedTrs);

      return $tbody;
    }

    function analyseTable($cleanedTable) {

      $cleanedTable.find('tr').each(function() {

        var $category = $(this).find('th');

        if ($category.length == 1) {
          categoryArr.push($category.text());

          var $record = $(this).find('td'),
            attrs = ['name', 'phase', 'fuel', 'ammo', 'steel', 'bauxite', 'develop', 'improve', 'cost', '', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'assist', 'remarks'],
            data = {};

          var i;
          for (i in attrs) {
            data[attrs[i]] = $record.eq(i).text();
          }

          console.log(data);
        }

        if ($category.length == 0) {

        }

      });
    }
  }

  fs.writeFile('output.html', kaisyuTable, function(err) {
    console.log('File successfully written! - Check your project directory for the output.html file');
  });

});