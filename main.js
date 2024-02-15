const BatchDownloadTpsC1 = require('./src/runners/BatchDownloadTpsC1')

const main = async () => {
    await BatchDownloadTpsC1(100);
}
main();