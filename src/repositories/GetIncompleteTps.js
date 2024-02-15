const { isReady } = require("../modules/db");

/**
 * @description This function load incomplete tps based on fileName null status
 * @param {number} count
 * @returns {Promise<Array<any>>}
 */
async function GetIncompleteTps(count) {
  const db = await isReady;
  const list = await db.all(
    `SELECT * FROM tps_c1_download_result WHERE fileName IS NULL LIMIT ${count} OFFSET 0`
  );
  return list;
}

module.exports = GetIncompleteTps;
