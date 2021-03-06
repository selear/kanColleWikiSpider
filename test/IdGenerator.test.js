const should = require('should');
const IdGenerator = require('../src/utility/IdGenerator');

describe('IdGenerator单元测试', function () {

  context('', function () {

    let clazzRef = IdGenerator;
    let clazzInstance = new IdGenerator();
    it('类引用/实例生成 测试', function () {
      should.exist(clazzRef, '类引用为 undefined');
      should.exist(clazzInstance, '实例为 undefined');
    });
  });

  context('生成器功能测试, 遍历测试内容依据id最大值动态变化', function () {

    const generatorInstancePkg = [
      { name: "default", instance: new IdGenerator() },
      { name: "length2", instance: new IdGenerator(2) },
      { name: "length3", instance: new IdGenerator(3) },
      { name: "length4", instance: new IdGenerator(4) }
    ];

    generatorInstancePkg.forEach(({ name, instance }) => {

      it(`实例'${ name }', 合规id范围[1, ${ instance.maxId })`, function () {
        (instance.now()).should.equal(0);
        for (let i = 1; i < instance.maxId; i++) {
          (instance.next()).should.equal(i);
        }
        (instance.next()).should.equal(instance.maxId);
        (instance.next()).should.equal(instance.maxId + 1);
      });
    });
  });

});