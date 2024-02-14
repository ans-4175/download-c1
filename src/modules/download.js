const axios = require('axios');
const fs = require('fs');
const path = require('path');

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

module.exports = { downloadTpsC1 }