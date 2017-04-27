const fs = require('fs');
const async = require('async');

async.waterfall([
    openFile,
    parseToJson,
    classifyEquip
  ],
  function(err, result) {
    if(err)
      console.log(err);
    else
      console.log(result);
});

const EXPORTS = {};
EXPORTS.openFile    = openFile;
EXPORTS.parseToJson = parseToJson;
EXPORTS.doExport    = doExport;

module.exports = EXPORTS;

function openFile(callback) {
  fs.readFile('./working/kaisyu-table-fixed.json', (err, data) => {
    if(err)
      callback(new Error(err));
    else
      callback(null, data);
  });
}

function parseToJson(fileContent, callback) {

  try {
    let contentInJson = JSON.parse(fileContent);
    callback(null, contentInJson);
  } catch(e) {
    callback(new Error('ERROR by processing JSON.parse()'));
  }
}

function classifyEquip(json, callback) {

  if(!json.categories) {

    callback(new Error('fileContent has NO "categories", or WRONG data.'));
  } else {

    let categoryMeta = objectify(json.categories);
    let classfiedMap = classifyCategory(categoryMeta);

    callback(null, classfiedMap);
  }

  // 将数组变为对象
  function objectify(categoryArr) {

    let categoryMeta = {};
    categoryArr.forEach(function(category) {
      categoryMeta[category.cName] = category.equipArr;
    });

    return categoryMeta;
  }

  // 组合不同的分类装备到"组合"中
  function classifyCategory(categoryMeta) {

    let classifyMap = new Map([
      ['小口径主炮/鱼雷', ['小口径主砲', '魚雷']],
      ['中口径主炮/副炮', ['中口径主砲', '副砲']],
      ['大口径主炮/强化弹', ['大口径主砲', '対艦強化弾']],
      ['舰战', ['艦上戦闘機']],
      ['舰爆/舰侦', ['艦上爆撃機', '艦上偵察機']],
      ['水侦/水战', ['水上偵察機', '水上戦闘機']],
      ['电探', ['電探']],
      ['机枪/高射装置', ['対空機銃', '高射装置']],
      ['声纳/爆雷/潜水艇装备', ['ソナ｜', '爆雷', '潜水艦装備']],
      ['登陆艇/探照灯/装甲带/动力', ['上陸用舟艇', '探照灯', 'バルジ', '機関部強化']]
    ]);

    let classfied = new Map();
    classifyMap.forEach((value, key) => {
      let arr = [];
      value.forEach((name) => {
        categoryMeta[name].forEach((equip) => {
          arr.push(equip);
        });
      });
      classfied.set(key, arr);
    });

    return classfied;
  }
}

function doExport(json, callback) {
  //输出数据
}