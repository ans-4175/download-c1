const { isReady } = require("../modules/db");

/**
 * @param {string} regionId
 * @param {string} uri
 * @param {string} fileName
 * @param {string} driveId
 * @returns {Promise<any>}
 */

async function ResetTpsDownloadInformation() {
  const db = await isReady;
  const parameter = {
    $fileName: null,
    $uri: null,
    $updatedAt: new Date(),
    $driveId: null,
  };
  await db.run(
    `UPDATE tps_c1_download_result SET fileName = $fileName, uri = $uri, updatedAt = $updatedAt, driveId = $driveId WHERE fileName IS NOT NULL`,
    parameter
  );
}

module.exports = ResetTpsDownloadInformation;
