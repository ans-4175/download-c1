class ElapsedTime {
  /**
   *
   * @param {number} start
   * @param {number} end
   */
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  value() {
    return this.end - this.start;
  }
  toString() {
    return `ElapsedTime(${value()} millis)`;
  }
}

class StopWatch {
  /**
   *
   * @param {number} start
   */
  constructor(start) {
    this.start = start;
  }
  stop() {
    return new ElapsedTime(this.start, new Date().getTime());
  }
}
module.exports = {
  start: () => new StopWatch(new Date().getTime()),
};
