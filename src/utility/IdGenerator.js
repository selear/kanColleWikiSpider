const chalk = require('chalk').default;

const redWarp = function (head, content, foot) {
  return chalk.red(head.concat(content).concat(foot));
};

class IdGenerator {

  #currId;
  #idLen;
  #maxVal;

  constructor(idLength = 2) {
    this.#currId = 0;
    this.#idLen = idLength;
    this.#maxVal = Number.parseInt('1'.concat('0'.repeat(idLength)));
  }

  get maxId() {
    return this.#maxVal;
  }

  now() {
    return this.#currId;
  }

  debug() {
    console.debug(`生成器最大长度为${ redWarp('[', this.#idLen, ']') }, 生成范围是${ redWarp('[1, ', this.#maxVal, ')') }`);
  }

  next() {
    let curr = ++this.#currId;
    if (curr >= this.#maxVal) {
      console.warn(chalk.redBright(`        生成器生成的id超出设计, curr_id = ${ curr }`));
    }
    return curr;
  }
}

module.exports = IdGenerator;