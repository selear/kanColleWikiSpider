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

  context('生成器功能测试', function () {

    it('默认id长度 = 2, id最大值为99', function () {

      let defaultGenerator = new IdGenerator();
      should.equal(defaultGenerator.maxId, 100, '新实例id最大值 不符合预期');
      should.equal(defaultGenerator.now(), 0, '新实例生成 id != 0');
      should.equal(defaultGenerator.next(), 1, '新实例首个 id != 1');

      for (let i = defaultGenerator.now(); i < 5; i++) {
        defaultGenerator.next();
      }
      should.equal(defaultGenerator.now(), 5, 'id != 5');
      should.equal(defaultGenerator.next(), 6, 'id != 6');

      for (let i = defaultGenerator.now(); i < 20; i++) {
        defaultGenerator.next();
      }
      should.equal(defaultGenerator.now(), 20, 'id != 20');
      should.equal(defaultGenerator.next(), 21, 'id != 21');

      for (let i = defaultGenerator.now(); i < defaultGenerator.maxId - 1; i++) {
        defaultGenerator.next();
      }
      should.equal(defaultGenerator.now(), 99, 'id != 99');
      should.equal(defaultGenerator.next(), 100, 'id != 100');
      should.equal(defaultGenerator.next(), 101, 'id != 101');
      // (function () { defaultGenerator.next() }).should.throw('生成器生成的id超出设计, curr_id = 100');
    });
  });
});