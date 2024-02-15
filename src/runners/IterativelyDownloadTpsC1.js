const Sleep = require("../modules/Sleep");
const BatchDownloadTpsC1 = require("./BatchDownloadTpsC1");

/**
 * @param {string} provinsiCode
 * @param {string} kotaKabupatenCode
 * @returns {Promise<any>}
 */
async function IterativelyDownloadTpsC1(provinsiCode, kotaKabupatenCode) {
  let isFinished = false;
  const count = 100;
  let offset = 0;

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
    } catch (e) {
      console.log("Error on fetching tps c1", e);
    } finally {
      offset += count;
    }
    await Sleep();
  }
}

module.exports = IterativelyDownloadTpsC1;
