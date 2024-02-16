const Sleep = require("../modules/Sleep");
const BatchDownloadTpsC1 = require("./BatchDownloadTpsC1");

/**
 * @param {string} provinsiCode
 * @param {string} kotaKabupatenCode
 * @returns {Promise<{count: number, totalErrorEncountered: number, duration: number}>}
 */
async function IterativelyDownloadTpsC1(provinsiCode, kotaKabupatenCode) {
  let isFinished = false;
  const count = 100;
  let offset = 0;
  let accumulatedProcessedTps = 0;
  let totalErrorEncountered = 0;
  const start = new Date();
  while (!isFinished) {
    try {
      console.log(
        "Begin fetching tps c1 using parameter offset",
        offset,
        "count",
        count,
        "and province",
        provinsiCode,
        "kota kabupaten",
        kotaKabupatenCode
      );
      const result = await BatchDownloadTpsC1(
        count,
        offset,
        provinsiCode,
        kotaKabupatenCode
      );
      console.log(
        "Finish fetching tps c1 using parameter offset!",
        "Result",
        result.count
      );
      accumulatedProcessedTps += result.count;
      if (result.count < count) {
        console.log("Finished scraping from tps!");
        isFinished = true;
      }
    } catch (e) {
      console.log("Error on fetching tps c1", e);
      totalErrorEncountered += 1;
    } finally {
      offset += count;
    }
    await Sleep();
  }
  const duration = new Date().getTime() - start.getTime();
  return {
    count: accumulatedProcessedTps,
    errorCount: totalErrorEncountered,
    duration: duration,
  };
}

module.exports = IterativelyDownloadTpsC1;
