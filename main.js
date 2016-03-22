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

	var utf8html;
	if (!error) {

		var iconv = require('iconv-lite'),
			decoded = iconv.decode(body, 'eucjp'),
			utf8html = iconv.encode(decoded, 'utf8');

		var $ = cheerio.load(utf8html);

		var $kaisyuTable = $('#kaisyu').parent().next().next().find('table'),
			$kaisyuTbody = $kaisyuTable.find('tbody');

		var removedTr = 0;
		$kaisyuTbody.find('tr').each(function() {
			var $tr = $(this);
			if ($tr.find('th').length > 1) {
				$tr.remove();
				removedTr++;
			}
		});

		var kaisyuTable = '<table><tbody>' + $kaisyuTbody.html() + '</tbody></table>';

		console.log('removedTr.length : ' + removedTr);
	}

	fs.writeFile('output.html', kaisyuTable, function(err) {

		console.log('File successfully written! - Check your project directory for the output.html file');

	});

	//console.log("Error" + error);
	//console.log("Response: " + response);
	//console.log("Body: " + html);
});


// app.get('/scrape', function(req, res) {

// 	url = 'http://wikiwiki.jp/kancolle/?%B2%FE%BD%A4%B9%A9%BE%B3';

// 	request(url, function(error, response, html) {

// 		var table;

// 		if (!error) {

// 			var $ = cheerio.load(html);

// 			table = $('#h3_content_1_6').next().next().html();

// 			console.log(table);
// 		}

// 		fs.writeFile('output.html', table, function(err) {
// 			console.log('File successfully written! - Check your project directory for the output.json file');
// 		});

// 	});
// });