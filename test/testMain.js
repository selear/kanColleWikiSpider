// 测试validateUtil.improveDetail正则表达式
//  正则表达式测试应当排序在basicTest之前
const regex = require('./regexTest');

regex.testSingular();
regex.testDual();

// 基础测试
const basic = require('./basicTest');

basic.testRuntime();
basic.testAssistShip();
basic.testResourceCost();