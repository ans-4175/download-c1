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
  let whereStatement = `fileName IS NULL`;
  let parameter = [];
  if (provinsiCode?.length) {
    const provincePlaceholders = provinsiCode.map(() => '?').join(', ');
    whereStatement += ` AND provinsiCode IN (${provincePlaceholders})`;
    parameter.push(...provinsiCode);
  }
  if (kotaKabupatenCode?.length) {
    const kotkabPlaceholders = kotaKabupatenCode.map(() => '?').join(', ');
    whereStatement += ` AND kotaKabupatenCode IN (${kotkabPlaceholders})`;
    parameter.push(...kotaKabupatenCode);
  }
  let realOffset = offset || 0;
  const query = `SELECT * FROM tps_c1_download_result WHERE ${whereStatement} LIMIT ${count} OFFSET ${realOffset}`;
  // console.log(provinsiCode, kotaKabupatenCode, query, parameter);
  const list = await db.all(query, parameter);
  return list;
}

module.exports = GetIncompleteTps;
