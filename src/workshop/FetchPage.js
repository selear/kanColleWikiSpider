import fs from "fs";
import req_promise from "request-promise";
import cheerio from "cheerio";

const BACK_TO_PROJECT_ROOT = '/../../';
const MAX_FILENAME_LENGTH = 256;

let options = {
  uri: 'http://localhost:32520/kaisyu',
  transform: (body) => {
    console.log('Connect Kaisyu Page...');
    return cheerio.load(body);
  }
};

function fetch() {
  return req_promise(options);
}


function save(filename, content) {

  checkFilename(filename);
  fs.writeFile(__dirname + BACK_TO_PROJECT_ROOT + filename, content, (err) => {
    if (err) {
      throw new Error(`Saving ${filename} occurs ERROR`);
    }
    console.log(`File >>> ${filename} <<< has been saved.`);
  });
}

function minmize($) {

  let table = $('#kaisyu').parent().next().next().find('table').parent();
  table.find('thead').remove().end().find('tfoot').remove();

  let invalidRemovedCount = 0;
  table.find('tr').each(function () {

    let th = $(this).find('th');
    let thLength = th.length;
    // $(this).find('th').length === 1时 就是categoryName
    if (thLength > 1) {
      $(this).remove();
      invalidRemovedCount++;
    } else if (thLength === 1 && th.text().length === 0) {
        th.remove();
    }
  });
  console.log(`invalid removed count - ${invalidRemovedCount}`);
  // DEBUG
  // console.log(`<tr> - length ${table.find('tbody>tr>th').length}`);
  return table;
}

function checkFilename(fileName) {

  const STRING_TYPE = '[object String]';
  // fixme
  if(toString.call(fileName) != STRING_TYPE) {
    throw new Error('Invalid filename param');
  }
  if(fileName.length > MAX_FILENAME_LENGTH) {
    throw new Error(`Invalid filename length - ${fileName.length}`);
  }
}

module.exports = {
  'fetch': fetch,
  'minmize': minmize,
  'save': save
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