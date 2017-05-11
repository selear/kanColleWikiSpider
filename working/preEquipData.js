var kanColle = {
  remodel: {

    /*
     *  访问路径: kanColle.remodel.extractEquip(equipName)
     *  返回数据: 一个数据对象
     *
     *  返回数据对象sample:
      {
        name: '三式爆雷投射機',
        icon: '爆雷',
        category: '爆雷',
        detail: [{
          assistant: '-',
          enableDays: [3, 4]
        }],
        remark: ''
      }
     */
    //函数名使用extract，主要考虑到返回的是装备对象。
    extractEquip: function(equipName) {
      var equip = this.equips[equipName];

      if (equip === undefined) {
        return {
          name: '未能寻找到该装备名称'
        };
      }

      equip.clazz = this.map_icon_class.searchClass(equip.icon);

      return equip;
    },

    /*
     *  访问路径: kanColle.remodel.extractCategoryEquipnames(categoryName)
     *  返回数据: 包含装备名称的数组
     */
    //函数名称使用search开头，主要是考虑到返回数组仅包含'string'，而非'object'
    searchEquipnamesByCategory: function(categoryName) {
      var equipnames = [];

      var equip, category;
      for (var index in this.equips) {

        equip = this.equips[index];
        category = equip.category;

        if (category === categoryName) {
          equipnames.push(equip.name);
        }
      }
      return equipnames;
    },

    searchCategoryIconClazzByName: function(categoryName) {
      return this.map_icon_class.searchClass(categoryName);
    },

    calcCategorySize: function(categoryName) {

      var equipnames = this.searchEquipnamesByCategory(categoryName);
      return equipnames.length;
    },

    calcDefaultSts: function() {

      var defaultIndex, i, defaultCheckedSts;
      defaultIndex = 0;
      defaultCheckedSts = '';

      var names = Object.keys(this.equips);

      for (i in names) {

        var name = names[i];
        if (name === this.defaultSelected[defaultIndex]) {
          defaultCheckedSts += 1;
          defaultIndex++;
        } else {
          defaultCheckedSts += 0;
        }
      }
      return defaultCheckedSts;
    },

    map_icon_class: {

      map: {
        '小口径主砲': 'main-cannon-light',
        '小口径主砲/副砲': 'main-cannon-light',
        '中口径主砲': 'main-cannon-medium',
        '大口径主砲': 'main-cannon-heavy',
        '高角砲': 'high-angle-gun',
        '副砲': 'secondary-canon',
        '対空機銃': 'anti-air-gun',
        '高射装置': 'anti-air-fire-director',
        '魚雷': 'torpedo',
        '爆雷': 'anti-sub-weapon',
        '聲呐': 'soner',
        '反潛裝備': 'anti-sub-weapon',
        '特種裝備': 'armour-piercing-shell',
        '対艦強化弾': 'armour-piercing-shell',
        '電探': 'rader',
        '探照灯': 'search-light',
        '水上偵察機' : 'recon-sea-plane',
        '大発動艇' : 'landing-craft',
        '艦載機' : 'carrier-fighter',
        '艦上戦闘機' : 'carrier-fighter'
        
      },

      searchClass: function(category) {

        var clazz = this.map[category];

        //如果输入了一个不正确的装备名称
        if (clazz === undefined) {
          throw 'in "map_icon_class" : ' + category + ' is NOT found.';
        }

        return clazz;
      },

      searchCategory: function(classStr) {
 
        var map = this.map;

        for (var key in map) {
          if (map[key] === classStr) {
            return key;
          } //如果全部没有找到
        }

        throw '无法找到class对应的装备类型';
      }
    }
  }
};

kanColle.remodel.categoryNameList = ['小口径主炮/鱼雷', '中口径主砲', '大口径主砲', '魚雷', '反潛裝備', '特種裝備', '電探', '艦載機'];
kanColle.remodel.defaultSelected = ['20.3cm(2号)連装砲', '20.3cm(3号)連装砲', '41cm連装砲', '46cm三連装砲', '61cm五連装(酸素)魚雷', '九一式徹甲弾'];
