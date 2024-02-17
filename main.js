const cron = require("node-cron");
const { program } = require("commander");
const BatchDownloadTpsC1 = require("./src/runners/BatchDownloadTpsC1");
const IterativelyDownloadTpsC1 = require("./src/runners/IterativelyDownloadTpsC1");
// UNCOMMENT if you want to run the cron job in long running
// cron.schedule('*/5 * * * *', async () => {
//     // run every 5 minutes
//     await BatchDownloadTpsC1(10000);
// });

program.option(
  "--iterative",
  "Perform scraping from start to finish using pagination by incomplete tps"
);
program.option("--province-code [string]", "Province code to scrape, if any");
program.option(
  "--kota-kabupaten-code [string]",
  "Kota kabupated code to scrape, if any"
);

// UNCOMMENT if you want to run the job once
const main = async () => {
  program.parse();
  const parsed = program.opts();
  const iterative = parsed.iterative;
  const provinceCode = parsed.provinceCode;
  const kotaKabupatenCode = parsed.kotaKabupatenCode;
  console.log(parsed);
  if (!iterative) {
    const count = 10000; // number of TPS to download per batch finding incomplete
    console.log("Begin performing download..");
    await BatchDownloadTpsC1(count, provinceCode, kotaKabupatenCode);
  } else {
    console.log("Begin performing download iteratively..");
    const result = await IterativelyDownloadTpsC1(
      provinceCode,
      kotaKabupatenCode
    );
    console.log("Finished performing iterative download!");
    console.log(`
      Total tps checked: ${result.count}
      Error encountered: ${result.totalErrorEncountered}
      Duration         : ${result.duration} millis
    `);
  }
};
main();
