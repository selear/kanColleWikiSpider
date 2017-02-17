var banner = function (text) {

  var SPACES = 8,
      PRE_SPACES = SPACES / 2;

  //针对变量fullLen，输出中文字符时，一个中文字符占用两个英文字符的位置；因此需要专门的函数计算字符串真实长度
  var fullLen = SPACES + calcRealLen(text),
      line = generateLine(fullLen),
      content = generateLine(PRE_SPACES, ' ') + text;

  console.log([line, content, line].join('\n'));
};

var calcTodayStr = function () {

  var currDate = new Date();
  var dateStr = currDate.toLocaleDateString();
  var hourStr = currDate.getHours();
  
  return '[' + dateStr + 'T' + hourStr + ']';
};

function generateLine(length, delimiter) {
  var DELIMITER = delimiter || '-';
  var line = new Array(length + 1).join(DELIMITER);
  return line;
}

/*
    函数参考:
      http://www.cnblogs.com/Chinajmz/archive/2009/06/20/1507244.html
 */
function calcRealLen(text) {

  var realLength = 0,
      len = text.length,
      charCode = -1;

  for (var i = 0; i < len; i++) {
    charCode = text.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1;
    } else {
      realLength += 2;
    }
  }
  return realLength;
}

exports.banner = banner;
exports.calcTodayStr = calcTodayStr;