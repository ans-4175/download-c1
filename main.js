const BatchDownloadTpsC1 = require('./src/runners/BatchDownloadTpsC1')
const cron = require('node-cron');

cron.schedule('*/5 * * * *', async () => {
    // run every 5 minutes
    await BatchDownloadTpsC1(100);
});
// const main = async () => {
//     await BatchDownloadTpsC1(100);
// }
// main();