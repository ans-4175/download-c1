const { isReady } = require("../modules/db");

/**
 * @description This function load incomplete tps based on fileName null status
 * @param {number} count
 * @param {number} offset
 * @param {string} provinsiCode
 * @param {string} kotaKabupatenCode
 * @returns {Promise<Array<any>>}
 */
async function GetIncompleteTps(
  count = 10,
  offset = null,
  provinsiCode = null,
  kotaKabupatenCode = null
) {
  const db = await isReady;
  let whereStatement = ` fileName IS NULL `;
  let parameter = {};
  if (provinsiCode) {
    whereStatement += ` AND provinsiCode = $provinsiCode`;
    parameter["$provinsiCode"] = provinsiCode;
  }
  if (kotaKabupatenCode) {
    whereStatement += ` AND kotaKabupatenCode = $kotaKabupatenCode`;
    parameter["$kotaKabupatenCode"] = kotaKabupatenCode;
  }
  let realOffset = offset || 0;
  const list = await db.all(
    `SELECT * FROM tps_c1_download_result WHERE ${whereStatement} LIMIT ${count} OFFSET ${realOffset}`,
    parameter
  );
  return list;
}

module.exports = GetIncompleteTps;
