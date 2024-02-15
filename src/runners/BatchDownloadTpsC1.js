const GetIncompleteTps = require("../repositories/GetIncompleteTps");
const Throttle = require("../modules/Throttle");
const { downloadTpsC1, flushFolderImageC1, isUploadDrive } = require("../modules/download");
const axios = require("axios");
const UpdateTpsWithDownloadInformation = require("../repositories/UpdateTpsWithDownloadInformation");

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

async function BatchDownloadTpsC1(count = 10, obj = {}) {
  const { provinsiCode, kotaKabupatenCode } = obj;

  const list = await GetIncompleteTps(count, { provinsiCode, kotaKabupatenCode });
  const throttler = new Throttle(100);
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
          const result = await downloadTpsC1({ code: tpsCode, url: c1Image });
          console.log(
            "Finish downloading and uploading to gdrive for c1Image",
            c1Image
          );
          const { fileName, path, driveId } = result;
          const updateResult = await UpdateTpsWithDownloadInformation(
            regionId,
            c1Image,
            fileName,
            driveId
          );
          console.log(
            "Finish updating region",
            region,
            "with c1Image",
            c1Image,
            "and driveId",
            driveId
          );
        }
      } catch (e) {
        console.log("Error on fetching tps c1 image", region, e);
      }
    });
  });
  await Promise.all(prList);
  if (isUploadDrive) await flushFolderImageC1();
}

module.exports = BatchDownloadTpsC1;
