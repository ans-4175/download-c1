const BatchDownloadTpsC1 = require('./src/runners/BatchDownloadTpsC1')
const cron = require('node-cron');

// UNCOMMENT if you want to run the cron job in long running
// cron.schedule('*/5 * * * *', async () => {
//     // run every 5 minutes
//     await BatchDownloadTpsC1(100);
// });

// UNCOMMENT if you want to run the job once
const main = async () => {
    const count = 100; // number of TPS to download per batch finding incomplete
    await BatchDownloadTpsC1(count);
}
main();