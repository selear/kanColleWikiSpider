var HttpProxyAgent = require('http-proxy-agent'),
    proxySS = 'http://127.0.0.1:1080',
    agent = new HttpProxyAgent(proxySS);

var request = require('request'),
    iconv = require('iconv-lite'),
    fs = require('fs');

var Buffer = require('buffer').Buffer;

request({
    uri: "http://wikiwiki.jp/kancolle/?%B2%FE%BD%A4%B9%A9%BE%B3",
    method: "GET",
    agent: agent,
    encoding: null, // encoding强制为null, 会返回Buffer, 而非utf-8解码后的页面, 后续使用iconv进行转码工作
    timeout: 10000,
}, function(err, res, body) {

    var html = iconv.decode(body, 'eucjp');

    console.log("Body: " + html);

    // fs.writeFile('output.html', html, function(err) {
    //   console.log('File successfully written! - Check your project directory for the output.json file');
    // });
});