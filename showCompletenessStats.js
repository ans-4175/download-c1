const GetTpsCompletenessStatistics = require("./src/repositories/GetTpsCompletenessStatistics");

async function main() {
  const result = await GetTpsCompletenessStatistics();
  console.log("Show tps completeness stats..");
  console.log(result);
}

main();
