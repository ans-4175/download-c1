const axios = require('axios');
const fs = require('fs');
const path = require('path');

const downloadImage = (response, pathToSaveImage) => {
    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(pathToSaveImage);
      const image = response.data.pipe(fileStream);
      fileStream.on('finish', () => resolve(image));
      fileStream.on('error', reject);
    });
  };

const downloadTpsC1 = async (obj) => {
    const { code: tp, url } = obj;
    return new Promise((resolve, reject) => {
        if (!url) return resolve(null);

        const province = tp.substring(0, 2);
        const regency = tp.substring(0, 4);
        const district = tp.substring(0, 6);
        const village = tp.substring(0, 10);
        const filename = `${province}_${regency}_${district}_${village}_${tp}.jpg`;
        const pathToSaveImage = path.resolve(__dirname, '..', '..', 'image-c1', filename);

        axios({
            url,
            method: 'GET',
            responseType: 'stream',
        }).then(async (response) => {
            const image = await downloadImage(response, pathToSaveImage);
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

module.exports = { downloadTpsC1 }