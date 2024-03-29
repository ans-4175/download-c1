const GetIncompleteTps = require("../repositories/GetIncompleteTps");
const Throttle = require("../modules/Throttle");
const Sleep = require("../modules/Sleep");
const {
  downloadC1,
  flushFolderC1,
  isUploadCloud,
} = require("../services/DownloadTPS");
const axios = require("axios");
const UpdateTpsWithDownloadInformation = require("../repositories/UpdateTpsWithDownloadInformation");
const Either = require("../modules/Either");

const generateTpsUrl = (code) => {
  const sanitizedCode = code.replace(/\./g, "");
  return `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${sanitizedCode.substring(
    0,
    2
  )}/${sanitizedCode.substring(0, 4)}/${sanitizedCode.substring(
    0,
    6
  )}/${sanitizedCode.substring(0, 10)}/${sanitizedCode}.json`;
};

/**
 * @description This function load incomplete tps, check if any of the tps-es has uploaded c1 form, then store them into appropriate location
 * @param {number} count
 * @param {number} offset
 * @param {string} provinsiCode
 * @param {string} kotaKabupatenCode
 * @returns {Promise<{ count: number, uploadResult: { result?: any} | { error?: Error} | null}>}
 */
async function BatchDownloadC1(
  count = 10,
  offset = 0,
  provinsiCode = null,
  kotaKabupatenCode = null
) {
  const list = await GetIncompleteTps(
    count,
    offset,
    provinsiCode,
    kotaKabupatenCode
  );
  const throttler = new Throttle(20);
  console.log("Found", list.length, "incomplete tps!");
  let progress = 0;
  const prList = list.map(async (region) => {
    return await throttler.offer(async () => {
      try {
        const tpsCode = region.tpsCode;
        const regionId = region.id;
        const tpsUri = generateTpsUrl(tpsCode);
        const resp = await axios.get(tpsUri);
        const images = resp.data.images;
        const c1Image = images[1];
        console.log("Finish fetching c1Image with uri", c1Image);
        if (c1Image) {
          let start = new Date();
          const result = await downloadC1({ code: tpsCode, url: c1Image });
          console.log(
            "Finish downloading and uploading to remote storage for c1Image",
            c1Image,
            "in",
            new Date().getTime() - start.getTime(),
            "millis"
          );
          const { fileName, path, driveId } = result;
          start = new Date();
          const updateResult = await UpdateTpsWithDownloadInformation(
            regionId,
            c1Image,
            fileName,
            driveId
          );
          console.log(
            "Finish updating region",
            region.id,
            "with c1Image",
            c1Image,
            "and remote identifier",
            driveId,
            "in",
            new Date().getTime() - start.getTime(),
            "millis"
          );
        }
      } catch (e) {
        console.log("Error on fetching tps c1 image", region.id, e);
      }
      progress += 1;
      console.log("BatchDownloadC1 progress", progress, "/", count);
      await Sleep.withRandomTime(5000);
    });
  });
  await Promise.all(prList);
  let uploadResult = null;
  try {
    const shouldUpload = await isUploadCloud();
    if (shouldUpload) await flushFolderC1();
    uploadResult = Either.Right(true);
  } catch (e) {
    uploadResult = Either.Left(e);
  }

  return {
    count: list.length,
    uploadResult,
  };
}

module.exports = BatchDownloadC1;
