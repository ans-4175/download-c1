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

const executeBatches = async (array, batchSize, delay, procFn) => {
    let iBatch = 0;

    async function executeBatch() {
        const batch = array.slice(iBatch, iBatch + batchSize);
        console.log(`start:${procFn.name}`, iBatch, batch);
        const pBatch = await procFn(batch);
        let batchResult = [];
        if (pBatch) {
            batchResult = await Promise.all(pBatch);
        }
        console.log(`done:${procFn.name}`, iBatch, batchResult);
        iBatch += batchSize;

        if (iBatch < array.length) {
            setTimeout(executeBatch, delay);
        }
    }

    await executeBatch();
}

const procTps = async (tps) => {
    const result = await tps.map(async (tp) => {
        const tpsUrl = generateTpsUrl(tp);
        const resp = await axios.get(tpsUrl);
        const images = resp.data.images;
        const c1Image = images[1];
        return downloadTpsC1({ code: tp, url: c1Image });
    });

    return result;
}

const procWilayah = async (wilayah) => {
    const result = await wilayah.reduce(async (previousTask, wil) => {
        await previousTask;
        const wilUrl = generateWilUrl(wil);
        const tps = await downloadWilayah(wilUrl);
        const batchSize = 3;
        const delay = 10000;
        const processTask = executeBatches(tps, batchSize, delay, procTps);
        return processTask;
    }, Promise.resolve());

    return result;
}

// MAIN TEST
const main = async () => {
    // TODO: change to handle all wilayah with sqlite
    const patternBdg = /^32\.73\.24\..*$/;
    const wilayah = kodeWilayah.filter((wil) => {
        return wil.match(patternBdg);
    });
    // const wilayah = [kodeWilayah[0], kodeWilayah[100]]
    // const wilayah = kodeWilayah;
    const batchSize = 3;
    const delay = 10000;
    executeBatches(wilayah, batchSize, delay, procWilayah);
}
main();