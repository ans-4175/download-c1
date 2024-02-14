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



// MAIN TEST
const main = async () => {
  const wilayah = [kodeWilayah[0], kodeWilayah[100]]

  wilayah.forEach(async (wil) => {
    // iterate per tps
    const wilUrl = generateWilUrl(wil);
    const tps = await downloadWilayah(wilUrl);
    tps.forEach(async (tp) => {
      const tpsUrl = generateTpsUrl(tp);
      const resp = await axios.get(tpsUrl);
      const images = resp.data.images;
      const c1Image = images[1];
      const respImage = await downloadTpsC1({ code: tp, url: c1Image });
      console.log(respImage)
    })
  });
}
main();