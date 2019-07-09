import fs from "fs";
import req_promise from "request-promise";
import cheerio from "cheerio";

const backToProjectRootPath = '/../../';

let options = {
  uri: 'http://localhost:32520/kaisyu',
  transform: (body) => {
    console.log('Connect Kaisyu Page...');
    return cheerio.load(body);
  }
};

function fetchExport() {
  req_promise(options)
    .then(($) => {
      storeFile('promiseTest.html', cleanTbody($).html());
    })
    .catch((err) => {
      console.log(`Error occurs - ${err}`);
    });
}


function storeFile(filename, content) {
  fs.writeFile(__dirname + backToProjectRootPath + filename, content, (err) => {
    if (err) {
      throw err;
    }
    console.log(`The file >>> ${filename} <<< has been saved.`);
  });
}

function cleanTbody($) {

  let removedLineCount = 0;
  let $tbody = $('#kaisyu').parent().next().next().find('table tbody');

  $tbody.find('tr').each(function () {
    let $currLine = $(this);
    if ($currLine.find('th').length > 1) {
      $currLine.remove();
      removedLineCount++;
    }
  });
  console.log(`removedLineCount - ${removedLineCount}`);
  return $tbody;
}

export {
  fetchExport as minmizeAfterFetch
};


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