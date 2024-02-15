const { isReady } = require("../modules/db");

/**
 * @param {string} regionId
 * @param {string} uri
 * @param {string} fileName
 * @param {string} driveId
 * @returns {Promise<any>}
 */

async function UpdateTpsWithDownloadInformation(
  regionId,
  uri,
  fileName,
  driveId
) {
  const db = await isReady;
  await db.run(
    `UPDATE tps_c1_download_result SET fileName = $fileName, uri = $uri, updatedAt = $updateAt, driveId = $driveId WHERE id = $id`,
    {
      $fileName: fileName,
      $uri: uri,
      $updatedAt: new Date(),
      $driveId: driveId,
      $id: regionId,
    }
  );
}

module.exports = UpdateTpsWithDownloadInformation;
