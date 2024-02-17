const Sleep = async (sleepTime = 1000) => {
  await new Promise((resolve) =>
    setTimeout(resolve, sleepTime ? parseInt(sleepTime, 10) : 1000)
  );
};

module.exports = Sleep;
module.exports.withRandomTime = async (seed = 10000) => {
  const time = (seed ? seed : 10000) * Math.random();
  return await Sleep(time);
};
