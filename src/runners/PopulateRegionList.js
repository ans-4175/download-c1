const InsertRegion = require("../repositories/InsertRegion");
const wilayahList = require("../../wilayah");
const Throttle = require("../modules/Throttle");
const axios = require("axios");
const generateWilUrl = (code, tps = "001") => {
  const sanitizedCode = code.replace(/\./g, "");
  return `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${sanitizedCode.substring(
    0,
    2
  )}/${sanitizedCode.substring(0, 4)}/${sanitizedCode.substring(
    0,
    6
  )}/${sanitizedCode}.json`;
};
async function PopulateRegionList() {
  const throttle = new Throttle(100);
  let count = 0;
  wilayahList.forEach(async (wilayahCode) => {
    throttle.offer(async () => {
      let ok = false;
      let retry = 0;
      while (!ok && retry < 5) {
        try {
          const uri = generateWilUrl(wilayahCode);
          const response = await axios.get(uri);
          const list = response.data;
          await list.reduce(async (memo, tps) => {
            await memo;
            const tpsCode = tps.kode;
            const splitted = wilayahCode.split(".");

            await InsertRegion(
              splitted[0],
              splitted[1],
              splitted[2],
              splitted[3],
              tpsCode
            );
          }, Promise.resolve());
          ok = true;
        } catch (e) {
          console.log("Failed to populate tps for", wilayahCode, e);
          console.log("Retrying..", retry, "/", 5);
          retry += 1;
        }
      }

      count += 1;
      console.log("Progress", count, "/", wilayahList.length);
    });
  });
}

PopulateRegionList();
