const { isReady } = require("../modules/db");

/**
 * @description This function create new region
 * @param {string} provinsiCode
 * @param {string} kotaKabupatenCode
 * @param {string} kecamatanCode
 * @param {string} kelurahanCode
 * @param {string} tpsCode
 * @returns {Promise<boolean>}
 */
async function InsertRegion(
  provinsiCode,
  kotaKabupatenCode,
  kecamatanCode,
  kelurahanCode,
  tpsCode
) {
  const db = await isReady;
  const id = [
    provinsiCode,
    kotaKabupatenCode,
    kecamatanCode,
    kelurahanCode,
    tpsCode,
  ].join("_");
  const result = await db.run(
    `
    INSERT OR IGNORE INTO tps_c1_download_result (id, provinsiCode, kotaKabupatenCode, kecamatanCode,kelurahanCode, tpsCode, createdAt)
    VALUES ($id,$provinsiCode, $kotaKabupatenCode, $kecamatanCode, $kelurahanCode, $tpsCode, $createdAt)
  `,
    {
      $id: id,
      $provinsiCode: provinsiCode,
      $kotaKabupatenCode: kotaKabupatenCode,
      $kecamatanCode: kecamatanCode,
      $kelurahanCode: kelurahanCode,
      $tpsCode: tpsCode,
      $createdAt: new Date(),
    }
  );
  return !!result.changes;
}

module.exports = InsertRegion;
