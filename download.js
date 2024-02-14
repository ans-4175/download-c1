const axios = require('axios');
const fs = require('fs');
const path = require('path');

const kodeWilayah = require('./wilayah');

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

const downloadTpsC1 = async (tp, url) => {
    return new Promise((resolve, reject) => {
        if (!url) return resolve(null);

        const province = tp.substring(0, 2);
        const regency = tp.substring(0, 4);
        const district = tp.substring(0, 6);
        const village = tp.substring(0, 10);
        const filename = `${province}_${regency}_${district}_${village}_${tp}.jpg`;
        const pathToSaveImage = path.resolve(__dirname, 'image-c1', filename);

        axios({
            url,
            method: 'GET',
            responseType: 'stream',
        }).then(response => {
            const image = response.data.pipe(fs.createWriteStream(pathToSaveImage));
            return resolve({
                meta: { province, regency, district, village, tps: tp },
                filename,
                path: image.path
            })
        }).catch(error => {
            reject(null)
        });
    });
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
      const respImage = await downloadTpsC1(tp, c1Image);

      console.log(respImage)
    })
  });
}
main();