// 基础测试
const basic = require('./basicTest');

basic.testRuntime();
basic.testAssistShip();
basic.testResourceCost();

// 测试validateUtil.improveDetail正则表达式
const regex = require('./regexTest');

regex.testSingular();
regex.testDual();