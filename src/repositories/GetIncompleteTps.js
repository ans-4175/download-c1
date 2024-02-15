const { isReady } = require("../modules/db");

/**
 * @description This function load incomplete tps based on fileName null status
 * @param {number} count
 * @returns {Promise<Array<any>>}
 */
async function GetIncompleteTps(count, obj) {
  const { provinsiCode, kotaKabupatenCode } = obj;
  const db = await isReady;
  let whereStatement = `fileName IS NULL`;
  if (provinsiCode) {
    whereStatement += ` AND provinsiCode='${provinsiCode}'`;
  }
  if (kotaKabupatenCode) {
    whereStatement += ` AND kotaKabupatenCode='${kotaKabupatenCode}'`;
  }
  const list = await db.all(
    `SELECT * FROM tps_c1_download_result WHERE ${whereStatement} LIMIT ${count} OFFSET 0`
  );
  return list;
}

module.exports = GetIncompleteTps;
