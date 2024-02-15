class Throttle {
  constructor(count) {
    this.maxParallelism = count;
    this.runningCount = 0;
    this.queue = [];
  }

  offer(fn) {
    let resolver = null;
    let rejecter = null;
    const pr = new Promise((resolve, reject) => {
      resolver = resolve;
      rejecter = reject;
    });
    const item = {
      pr: pr,
      resolver,
      rejecter,
      runner: fn,
    };
    this.queue.push(item);
    this.run();
    return pr;
  }

  run() {
    if (this.runningCount >= this.maxParallelism) return;
    else {
      const item = this.queue.shift();
      if (item) {
        this.runningCount = this.runningCount + 1;
        item
          .runner()
          .then((result) => {
            this.runningCount = this.runningCount - 1;
            item.resolver(result);
          })
          .catch((err) => {
            this.runningCount = this.runningCount - 1;
            item.rejecter(err);
          })
          .then(() => this.run());
      } else {
      }
    }
  }
}

module.exports = Throttle;
