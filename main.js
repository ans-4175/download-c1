const axios = require('axios');
const kodeWilayah = require('./wilayah');
const { downloadTpsC1 } = require('./src/modules/download');

const generateWilUrl = (code, tps = '001') => {
  const sanitizedCode = code.replace(/\./g, '');
  return `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${sanitizedCode.substring(0,2)}/${sanitizedCode.substring(0,4)}/${sanitizedCode.substring(0,6)}/${sanitizedCode}.json`
}
const generateTpsUrl = (code) => {
  const sanitizedCode = code.replace(/\./g, '');
  return `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${sanitizedCode.substring(0,2)}/${sanitizedCode.substring(0,4)}/${sanitizedCode.substring(0,6)}/${sanitizedCode.substring(0,10)}/${sanitizedCode}.json`
}
const downloadWilayah = async (url) => {
    const resp = await axios.get(url)
    return resp.data.map((tps) => { return tps.kode});
}

const procWilayah = async (wilayah) => {
    const result = await wilayah.reduce(async (previousTask, wil) => {
        await previousTask;
        const wilUrl = generateWilUrl(wil);
        const tps = await downloadWilayah(wilUrl);
        const processTask = tps.map(async (tp) => {
            const tpsUrl = generateTpsUrl(tp);
            const resp = await axios.get(tpsUrl);
            const images = resp.data.images;
            const c1Image = images[1];
            return downloadTpsC1({ code: tp, url: c1Image });
            // const respImage = await downloadTpsC1({ code: tp, url: c1Image });
            // console.log(respImage)
        });
        return processTask;
    }, Promise.resolve());

    return result;
}


// MAIN TEST
const main = async () => {
    // TODO: change to handle all wilayah with sqlite
//   const wilayah = [kodeWilayah[0], kodeWilayah[100]]
  const wilayah = kodeWilayah;
  const batchSize = 10;
  const delay = 1000;
  let iBatch = 0;

  async function executeBatch() {
      const batch = wilayah.slice(iBatch, iBatch + batchSize);
      console.log(iBatch, batch);
      const res = await procWilayah(batch);
      iBatch += batchSize;

      if (iBatch < wilayah.length) {
          setTimeout(executeBatch, delay);
      }
  }

  executeBatch();
}
main();